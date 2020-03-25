import { CardModel } from '@shared/models/payment/card.model';
import { PaymentModel } from '@shared/models/payment/payment.model';
import { UserLiteModel } from '@shared/models/user/user-lite.model';
import { Response } from 'express';
import * as stripe from 'stripe';
import { v4 as nodeUUId } from 'uuid';
import { emailBroker } from '../../communication/emailer-broker';
import { logger } from '../../core/utils/logger';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/base-service';
import { usersRepository } from '../users/users.repository';
import { paymentsRepository } from './payments.repository';

class PaymentsService extends BaseService {

    readonly userRequiredError = 'User required';
    stripe = new stripe(environment.stripe.secretKey);

    constructor() {
        super();
    }

    webhook(res: Response, body: string, signature: string): void {
        const endpointSecret = 'whsec_7hHeH4qkv0PPoujR2baM9wp295aYRVpp';

        let event;
        try {
            event = this.stripe.webhooks.constructEvent(body, signature, endpointSecret);
        } catch (err) {
            logger.error(err);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        if (event) {
            switch (event.type) {
                case 'payment_intent.created':
                    break;
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    console.log(paymentIntent);
                    // TODO: set status on payment node to successful
                    // emailBroker.paymentSuccessful({
                    //     email,
                    //     amount
                    // });
                    break;
                case 'charge.succeeded':
                    break;
                case 'payment_method.attached':
                    break;
                default:
                    // Unexpected event type
                    logger.warn(`Unexpected Stripe event type = ${event.type}`, event);
                    return res.status(400).end();
            }

            // Return a response to acknowledge receipt of the event
            res.json({ received: true });
        } else {
            res.status(400);
        }
    }

    async anonymousPayment(res: Response, amount: number, email: string): Promise<string> {
        const options = this.createPaymentIntentOptions(amount, null, null, email);
        const paymentIntent = await this.stripe.paymentIntents.create(options);

        await paymentsRepository.anonymousPayment(res,
            paymentIntent.metadata.paymentUId, paymentIntent.id, paymentIntent.created, amount, email);

        return paymentIntent.client_secret;
    }

    async userPayment(res: Response, cardUId: string, amount: number, saveCard: boolean): Promise<boolean> {
        const token = 'temp';
        const userId = this.getUserId(res);
        const user = await usersRepository.getUserById(res, userId);

        if (!user) {
            const errorMessage = 'User not found during payment';
            logger.error(errorMessage, [userId]);
            throw new Error(errorMessage);
        }

        const selectedCard = user.paymentCards.find(card => card.uId === cardUId);
        if (selectedCard) {
            // Existing customer and card
            const charge = await this.createCharge(selectedCard.stripeCardId, amount, user.id, user.stripeCustomerId);

            emailBroker.paymentSuccessful({
                email: user.email,
                amount
            });

            return await paymentsRepository.userPayment(res, this.getUserId(res), selectedCard.uId,
                charge.metadata.paymentUId, amount, charge.id, charge.created);
        } else if (token) {
            // New card
            if (saveCard) {
                const cardDetails = await this.getStripeCardDetails(res, token);

                // TODO: check expire date
                const existingCard = user.paymentCards
                    .find(card => cardDetails.card ? card.stripeFingerprint === cardDetails.card.fingerprint : false);

                if (existingCard) {
                    const charge = await this.createCharge(existingCard.stripeCardId, amount, user.id, user.stripeCustomerId);

                    emailBroker.paymentSuccessful({
                        email: user.email,
                        amount
                    });

                    return await paymentsRepository.userPayment(res, this.getUserId(res), existingCard.uId,
                        charge.metadata.paymentUId, amount, charge.id, charge.created);
                } else {
                    const newCard = await this.createStripeCard(res, user, token);

                    const charge = await this.createCharge(newCard.card.stripeCardId, amount, user.id, newCard.stripeCustomerId);

                    emailBroker.paymentSuccessful({
                        email: user.email,
                        amount
                    });

                    return await paymentsRepository.userPayment(res, this.getUserId(res), newCard.card.uId,
                        charge.metadata.paymentUId, amount, charge.id, charge.created);
                }
            } else {
                // TODO: This could be associated with a stripe customer but don't know how without saving the card which I don't want to do
                const charge = await this.createCharge(token, amount, user.id);

                emailBroker.paymentSuccessful({
                    email: user.email,
                    amount
                });

                return await paymentsRepository.userPayment(res, this.getUserId(res), null,
                    charge.metadata.paymentUId, amount, charge.id, charge.created);
            }
        } else {
            const errorMessage = 'Neither card was found nor token was provided';
            logger.error(errorMessage, [userId, cardUId, token, amount]);
            throw new Error(errorMessage);
        }
    }

    async paymentCards(res: Response): Promise<CardModel[] | null> {
        return await paymentsRepository.paymentCards(res, this.getUserId(res));
    }

    async createCard(res: Response, token: string): Promise<CardModel> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        return (await this.createStripeCard(res, user, token)).card;
    }

    async deleteCard(res: Response, uId: string): Promise<boolean> {
        const userId = this.getUserId(res);
        const user = await usersRepository.getUserById(res, userId);

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        const card = user.paymentCards.find(userCard => userCard.uId === uId);

        if (card && (!card.isDefault || user.paymentCards.length === 1)) {
            try {
                const deleteConfirmation = await this.stripe.customers.deleteCard(user.stripeCustomerId, card.stripeCardId);
                if (deleteConfirmation.deleted) {
                    return await paymentsRepository.deleteCard(res, userId, card.uId);
                } else {
                    const errorMessage = 'Stripe failed deleting card';
                    logger.error(errorMessage, [userId, uId, card]);
                    throw new Error(errorMessage);
                }
            } catch {
                const errorMessage = 'Stripe error while deleting card';
                logger.error(errorMessage, [userId, uId, card]);
                throw new Error(errorMessage);
            }
        } else {
            const errorMessage = 'Cannot delete card';
            logger.error(errorMessage, [userId, uId]);
            throw new Error(errorMessage);
        }
    }

    async updateDefaultCard(res: Response, uId: string): Promise<boolean> {
        const userId = this.getUserId(res);
        const user = await usersRepository.getUserById(res, userId);

        if (!user) {
            throw new Error(this.userRequiredError);
        }

        const card = user.paymentCards.find(userCard => userCard.uId === uId);

        if (!card) {
            const errorMessage = 'User default card could not be found';
            logger.error(errorMessage, [userId, uId, user]);
            throw new Error(errorMessage);
        }

        try {
            const updatedCustomer = await this.stripe.customers.update(user.stripeCustomerId,
                {
                    default_source: card.stripeCardId
                });

            return await paymentsRepository.updateDefaultCard(res, userId, card.uId);
        } catch (error) {
            const errorMessage = 'Error updating default card on Stripe for customer';
            logger.error(errorMessage, [userId, uId, user, card]);
            throw new Error(errorMessage);
        }
    }

    async paymentHistory(res: Response): Promise<PaymentModel[] | null> {
        return await paymentsRepository.paymentHistory(res, this.getUserId(res));
    }

    // #region Private

    private createPaymentIntentOptions(amount: number, userId: number | null = null, customerId: string | null = null,
        email: string | null = null) {
        const intentOptions: stripe.paymentIntents.IPaymentIntentCreationOptions = {
            amount: amount * 100,
            currency: 'EUR',
            description: 'Donation',
            metadata: {
                paymentUId: nodeUUId()
            }
        };

        if (intentOptions.metadata) {
            if (userId) {
                intentOptions.metadata.userId = userId;
            }
            if (email) {
                intentOptions.metadata.email = email;
            }
        }

        if (customerId) {
            intentOptions.customer = customerId;
        }

        return intentOptions;
    }

    private async createCharge(source: string, amount: number, userId: number | null = null,
        customerId: string | null = null, email: string | null = null) {
        const chargeCreationOptions: stripe.charges.IChargeCreationOptions = {
            amount: amount * 100,
            currency: 'EUR',
            description: 'Donation',
            source,
            metadata: {
                paymentUId: nodeUUId()
            }
        };

        if (chargeCreationOptions.metadata) {
            if (userId) {
                chargeCreationOptions.metadata.userId = userId;
            }
            if (email) {
                chargeCreationOptions.metadata.email = email;
            }
        }

        if (customerId) {
            chargeCreationOptions.customer = customerId;
        }

        try {
            return await this.stripe.charges.create(chargeCreationOptions);
        } catch (error) {
            const errorMessage = 'Error creating charge';
            logger.error(errorMessage, [error, chargeCreationOptions]);
            throw new Error(errorMessage);
        }
    }

    private async createStripeCard(res: Response, user: UserLiteModel, token: string)
        : Promise<{ card: CardModel, stripeCustomerId: string }> {
        try {
            if (!user.stripeCustomerId) {
                const customer = await this.stripe.customers.create({
                    source: token,
                    email: user.email,
                    metadata: {
                        userId: user.id,
                        userUId: user.uId
                    }
                });

                const retrievedCustomer = await this.stripe.customers.retrieve(customer.id, {
                    expand: ['default_source']
                });

                const card = await paymentsRepository.createCard(
                    res,
                    this.getUserId(res),
                    customer.id,
                    nodeUUId(),
                    (retrievedCustomer.default_source as stripe.cards.ICard).id,
                    (retrievedCustomer.default_source as stripe.cards.ICard).fingerprint,
                    (retrievedCustomer.default_source as stripe.cards.ICard).brand,
                    (retrievedCustomer.default_source as stripe.cards.ICard).last4,
                    +(retrievedCustomer.default_source as stripe.cards.ICard).exp_month,
                    +(retrievedCustomer.default_source as stripe.cards.ICard).exp_year
                );

                if (!card) {
                    const errorMessage = 'Error creating Stripe card with new customer';
                    logger.error(errorMessage, [user, customer, retrievedCustomer]);
                    throw new Error(errorMessage);
                }

                return {
                    card,
                    stripeCustomerId: customer.id
                };
            } else {
                const newCard = await this.stripe.customers.createSource(user.stripeCustomerId, {
                    source: token
                }) as stripe.ICard;

                const userId = this.getUserId(res);
                const card = await paymentsRepository.createCard(res, userId, user.stripeCustomerId,
                    nodeUUId(), newCard.id, newCard.fingerprint, newCard.brand, newCard.last4, +newCard.exp_month, +newCard.exp_year);

                if (!card) {
                    const errorMessage = 'Error creating Stripe card with existing';
                    logger.error(errorMessage, [userId, user, newCard]);
                    throw new Error(errorMessage);
                }

                return {
                    card,
                    stripeCustomerId: user.stripeCustomerId
                };
            }
        } catch (error) {
            const errorMessage = 'Error creating Stripe card';
            logger.error(errorMessage, [error, user, token]);
            throw new Error(errorMessage);
        }
    }

    private async getStripeCardDetails(res: Response, token: string): Promise<stripe.tokens.IToken> {
        try {
            return await this.stripe.tokens.retrieve(token);
        } catch (error) {
            const errorMessage = 'Error getting Stripe card details';
            logger.error(errorMessage, [error, token]);
            throw new Error(errorMessage);
        }
    }

    // #endregion

}

export const paymentsService = new PaymentsService();
