import { PaymentModel } from '@shared/models/payment/payment.model';
import { UserLiteModel } from '@shared/models/user/user-lite.model';
import { UserModel } from '@shared/models/user/user.model';
import { CardViewModel } from '@shared/view-models/payment/card.view-model';
import { StripeIntentViewModel } from '@shared/view-models/payment/stripe-intent.view-model';
import { Response } from 'express';
import Stripe from 'stripe';
import { emailBroker } from '../../communication/emailer-broker';
import { stripe } from '../../core/middleware/stripe';
import { logger } from '../../core/utils/logger';
import { BaseService } from '../shared/base-service';
import { usersRepository } from '../users/users.repository';
import { paymentsRepository } from './payments.repository';

class PaymentsService extends BaseService {

    readonly userRequiredError = 'User required';

    constructor() {
        super();
    }

    async createPaymentIntent(res: Response, amount: number, currency: string, cardId: string | undefined,
        saveCard: boolean = false, email: string | undefined): Promise<StripeIntentViewModel> {
        const intentCreateParams: Stripe.PaymentIntentCreateParams = {
            // Amount should be calculated on the server. Eg bought 1 book = 10 euro
            amount: amount * 100,
            currency: currency || 'EUR',
            description: 'Donation',
            metadata: {}
        };

        const userId = this.getOptionalUserId(res);
        let user: UserModel | null = null;

        if (userId) {
            user = await usersRepository.getUserById(res, userId);

            if (user) {
                // Get Stripe customer
                user.stripeCustomerId = await this.getStripeCustomerId(res, user);
                intentCreateParams.customer = user.stripeCustomerId;
                intentCreateParams.receipt_email = user.email;

                // Pay with existing card
                const cards = await this.getStripeCards(user.stripeCustomerId);
                if (cardId) {
                    const defaultCard = cards.find(card => cardId && card.id === cardId) || cards.find(card => card.isDefault) || cards[0];
                    intentCreateParams.payment_method = defaultCard.id;
                    intentCreateParams.confirm = true;
                    intentCreateParams.setup_future_usage = 'off_session';
                }

                if (saveCard) {
                    intentCreateParams.setup_future_usage = 'off_session';
                }
            }
        }

        // Set intent metadata if not authorized (anonymous)
        if (!user && email && intentCreateParams.metadata) {
            intentCreateParams.receipt_email = email;
            intentCreateParams.metadata.email = email;
        }

        try {
            const paymentIntent = await stripe.paymentIntents.create(intentCreateParams);

            const responseViewModel = new StripeIntentViewModel();
            responseViewModel.clientSecret = paymentIntent.client_secret;

            return responseViewModel;
        } catch (error) {
            const errorMessage = 'Error creating payment intent';
            logger.error(errorMessage, [error, intentCreateParams]);
            throw new Error(errorMessage);
        }
    }

    async stripeWebhook(res: Response, data: Stripe.Event.Data, eventType: string): Promise<void> {
        const paymentIntent: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;

        if (eventType === 'payment_intent.succeeded') {
            let user = null;
            if (paymentIntent.customer && paymentIntent.receipt_email) {
                user = await usersRepository.getUserByEmailOrUsername(res, paymentIntent.receipt_email);
            }

            // Authenticated user
            if (user) {
                emailBroker.paymentSuccessful({
                    email: user.email,
                    amount: paymentIntent.amount
                });

                await paymentsRepository.userPayment(res, user.id, paymentIntent.id, paymentIntent.amount, paymentIntent.created);
            } else if (paymentIntent.receipt_email) {
                // Anonymous
                emailBroker.paymentSuccessful({
                    email: paymentIntent.receipt_email,
                    amount: paymentIntent.amount
                });

                await paymentsRepository.anonymousPayment(res, paymentIntent.id,
                    paymentIntent.amount, paymentIntent.created, paymentIntent.receipt_email);
            }
        } else if (eventType === 'payment_intent.payment_failed') {
            // TODO: Payment failed
        }
    }

    async paymentCards(res: Response): Promise<CardViewModel[] | null> {
        const userId = this.getUserId(res);
        const user = await usersRepository.getUserById(res, userId);

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        return this.getStripeCards(user.stripeCustomerId);
    }

    async createCardIntent(res: Response, setAsDefault: boolean): Promise<StripeIntentViewModel> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        user.stripeCustomerId = await this.getStripeCustomerId(res, user);
        const metadata: any = {};

        if (setAsDefault) {
            metadata.dateLastUpdatedDefault = new Date().toISOString();
        }

        try {
            const intent = await stripe.setupIntents.create();

            const viewModel = new StripeIntentViewModel();
            viewModel.clientSecret = intent.client_secret;

            return viewModel;
        } catch (error) {
            const errorMessage = 'Error creating card intent';
            logger.error(errorMessage, [error]);
            throw new Error(errorMessage);
        }
    }

    async createCard(res: Response, paymentMethodId: string): Promise<boolean> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        user.stripeCustomerId = await this.getStripeCustomerId(res, user);

        try {
            await stripe.paymentMethods.attach(paymentMethodId, { customer: user.stripeCustomerId });
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteCard(res: Response, id: string): Promise<boolean> {
        try {
            await stripe.paymentMethods.detach(id);
            return true;
        } catch (error) {
            return false;
        }
    }

    async updateDefaultCard(res: Response, id: string): Promise<boolean> {
        try {
            await stripe.paymentMethods.update(id, {
                metadata: {
                    dateLastUpdatedDefault: new Date().toISOString()
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async paymentHistory(res: Response): Promise<PaymentModel[] | null> {
        return await paymentsRepository.paymentHistory(res, this.getUserId(res));
    }

    async getStripeCustomerId(res: Response, user: UserLiteModel): Promise<string> {
        // Stripe customer exists
        if (user.stripeCustomerId) {
            return user.stripeCustomerId;
        } else {
            // Create Stripe customer
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.username,
                metadata: {
                    userId: user.id,
                    userUId: user.uId
                }
            });

            await paymentsRepository.updateStripeCustomer(res, user.id, customer.id);

            user.stripeCustomerId = customer.id;
            return customer.id;
        }
    }

    async getStripeCards(stripeCustomerId?: string): Promise<CardViewModel[]> {
        if (!stripeCustomerId) {
            return [];
        }

        const listCards = (await stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' })).data;

        // Sort default first
        listCards.sort((a, b) => {
            const aDateString = a.metadata.dateLastUpdatedDefault;
            const bDateString = b.metadata.dateLastUpdatedDefault;
            const aDate = new Date(aDateString);
            const bDate = new Date(bDateString);

            if (!aDateString && bDateString) {
                return 1;
            } else if (aDateString && !bDateString) {
                return -1;
            } else if (aDate === bDate) {
                return 0;
            } else {
                if (aDate < bDate) {
                    return 1;
                } else if (aDate > bDate) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });

        return listCards
            .filter(paymentMethod => paymentMethod.card !== undefined)
            .map((paymentMethod, index) => {
                const viewModel = new CardViewModel();
                viewModel.id = paymentMethod.id;
                if (paymentMethod.card) {
                    viewModel.expireMonth = paymentMethod.card.exp_month;
                    viewModel.expireYear = paymentMethod.card.exp_year;
                    viewModel.brand = paymentMethod.card.brand;
                    viewModel.last4 = paymentMethod.card.last4;
                }
                viewModel.isDefault = index === 0;
                return viewModel;
            });
    }
}

export const paymentsService = new PaymentsService();
