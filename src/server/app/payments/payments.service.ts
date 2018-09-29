import { Response } from 'express';
import * as stripe from 'stripe';
import { v4 as nodeUUId } from 'uuid';
import { CardModel } from '../../../shared/models/payment/card.model';
import { PaymentModel } from '../../../shared/models/payment/payment.model';
import { UserLiteModel } from '../../../shared/models/user/user-lite.model';
import { Emailer } from '../../email/emailer';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/base-service';
import { usersRepository } from '../users/users.repository';
import { paymentsRepository } from './payments.repository';

class PaymentsService extends BaseService {

    constructor() {
        super();
    }

    // #region Private

    private async createCharge(res: Response, source: string, amount: number,
        userId: null | number = null, customerId: null | string = null) {
        const stripeAccount = new stripe(environment.stripe.secretKey);

        const chargeCreationOptions: stripe.charges.IChargeCreationOptions = {
            amount: amount * 100,
            currency: 'EUR',
            description: 'Donation',
            source: source,
            metadata: {
                paymentUId: nodeUUId()
            }
        };
        if (userId) {
            if (chargeCreationOptions.metadata) {
                chargeCreationOptions.metadata['userId'] = userId;
            }
        }
        if (customerId) {
            chargeCreationOptions['customer'] = customerId;
        }

        try {
            return await stripeAccount.charges.create(chargeCreationOptions);
        } catch (error) {
            throw new Error('Error creating charge');
        }
    }

    private async createStripeCard(res: Response, user: UserLiteModel, token: string)
        : Promise<{ card: CardModel, stripeCustomerId: string }> {
        const stripeAccount = new stripe(environment.stripe.secretKey);

        try {
            if (!user.stripeCustomerId) {
                const customer = await stripeAccount.customers.create({
                    source: token,
                    email: user.email,
                    metadata: {
                        userId: user.id,
                        userUId: user.uId
                    }
                });

                const retrievedCustomer = await stripeAccount.customers.retrieve(customer.id, {
                    expand: ['default_source']
                });

                const card = await paymentsRepository.createCard(
                    res,
                    this.getUserId(res),
                    customer.id,
                    nodeUUId(),
                    (<stripe.cards.ICard>retrievedCustomer.default_source).id,
                    (<stripe.cards.ICard>retrievedCustomer.default_source).fingerprint,
                    (<stripe.cards.ICard>retrievedCustomer.default_source).brand,
                    (<stripe.cards.ICard>retrievedCustomer.default_source).last4,
                    +(<stripe.cards.ICard>retrievedCustomer.default_source).exp_month,
                    +(<stripe.cards.ICard>retrievedCustomer.default_source).exp_year
                );

                if (!card) {
                    throw new Error('Error creating Stripe card with new customer');
                }

                return {
                    card,
                    stripeCustomerId: customer.id
                };
            } else {
                const newCard = await stripeAccount.customers.createSource(user.stripeCustomerId, {
                    source: token
                }) as stripe.ICard;

                const card = await paymentsRepository.createCard(res, this.getUserId(res), user.stripeCustomerId,
                    nodeUUId(), newCard.id, newCard.fingerprint, newCard.brand, newCard.last4, +newCard.exp_month, +newCard.exp_year);

                if (!card) {
                    throw new Error('Error creating Stripe card with existing');
                }

                return {
                    card,
                    stripeCustomerId: user.stripeCustomerId
                };
            }
        } catch (error) {
            throw new Error('Error creating Stripe card');
        }
    }

    private async getStripeCardDetails(res: Response, token: string): Promise<stripe.tokens.IToken> {
        const stripeAccount = new stripe(environment.stripe.secretKey);

        try {
            return await stripeAccount.tokens.retrieve(token);
        } catch (error) {
            throw new Error('Error getting Stripe card details');
        }
    }

    // #endregion

    async anonymousPayment(res: Response, token: string, amount: number, email: string): Promise<boolean> {
        const charge = await this.createCharge(res, token, amount);

        Emailer.paymentSuccessfulEmail(email, amount);

        return await paymentsRepository.anonymousPayment(res, charge.metadata.paymentUId, charge.id, charge.created, amount, email);
    }

    async userPayment(res: Response, cardUId: string, token: string | null, amount: number, saveCard: boolean): Promise<boolean> {
        const user = await usersRepository.getUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error('User not found during payment');
        }

        const selectedCard = user.userCards.find(x => x.uId === cardUId);
        if (selectedCard) {
            // Existing customer and card
            const charge = await this.createCharge(res, selectedCard.stripeCardId, amount, user.id, user.stripeCustomerId);

            Emailer.paymentSuccessfulEmail(user.email, amount);

            return await paymentsRepository.userPayment(res, this.getUserId(res), selectedCard.uId,
                charge.metadata.paymentUId, amount, charge.id, charge.created);
        } else if (token) {
            // New card
            if (saveCard) {
                const cardDetails = await this.getStripeCardDetails(res, token);

                // TODO: check expire date
                const existingCard = user.userCards
                    .find(x => cardDetails.card ? x.stripeFingerprint === cardDetails.card.fingerprint : false);

                if (existingCard) {
                    const charge = await this.createCharge(res, existingCard.stripeCardId, amount, user.id, user.stripeCustomerId);

                    Emailer.paymentSuccessfulEmail(user.email, amount);

                    return await paymentsRepository.userPayment(res, this.getUserId(res), existingCard.uId,
                        charge.metadata.paymentUId, amount, charge.id, charge.created);
                } else {
                    const newCard = await this.createStripeCard(res, user, token);

                    const charge = await this.createCharge(res, newCard.card.stripeCardId, amount, user.id, newCard.stripeCustomerId);

                    Emailer.paymentSuccessfulEmail(user.email, amount);

                    return await paymentsRepository.userPayment(res, this.getUserId(res), newCard.card.uId,
                        charge.metadata.paymentUId, amount, charge.id, charge.created);
                }
            } else {
                // TODO: This could be associated with a stripe customer but don't know how without saving the card which I don't want to do
                const charge = await this.createCharge(res, token, amount, user.id);

                Emailer.paymentSuccessfulEmail(user.email, amount);

                return await paymentsRepository.userPayment(res, this.getUserId(res), null,
                    charge.metadata.paymentUId, amount, charge.id, charge.created);
            }
        } else {
            throw new Error('Neither card was found nor token was provided');
        }
    }

    async userCards(res: Response): Promise<CardModel[] | null> {
        return await paymentsRepository.userCards(res, this.getUserId(res));
    }

    async createCard(res: Response, token: string): Promise<CardModel> {
        const user = await usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error('User required');
        }

        return (await this.createStripeCard(res, user, token)).card;
    }

    async deleteCard(res: Response, uId: string): Promise<boolean> {
        const user = await usersRepository.getUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error('User required');
        }

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.userCards.find(x => x.uId === uId);

        if (card && (!card.isDefault || user.userCards.length === 1)) {
            try {
                const deleteConfirmation = await stripeAccount.customers.deleteCard(user.stripeCustomerId, card.stripeCardId);
                if (deleteConfirmation.deleted) {
                    return await paymentsRepository.deleteCard(res, this.getUserId(res), card.uId);
                } else {
                    throw new Error('Stripe failed deleting card');
                }
            } catch {
                throw new Error('Stripe error while deleting card');
            }
        } else {
            throw new Error('Cannot delete card');
        }
    }

    async updateDefaultCard(res: Response, uId: string): Promise<boolean> {
        const user = await usersRepository.getUserById(res, this.getUserId(res));

        if (!user) {
            throw new Error('User required');
        }

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.userCards.find(x => x.uId === uId);

        if (!card) {
            throw new Error('User default card could not be found');
        }

        try {
            const updatedCustomer = await stripeAccount.customers.update(user.stripeCustomerId,
                {
                    default_source: card.stripeCardId
                });

            return await paymentsRepository.updateDefaultCard(res, this.getUserId(res), card.uId);
        } catch (error) {
            throw new Error('Error updating default card on Stripe for customer');
        }
    }

    async paymentHistory(res: Response): Promise<PaymentModel[] | null> {
        return await paymentsRepository.paymentHistory(res, this.getUserId(res));
    }
}

export const paymentsService = new PaymentsService();
