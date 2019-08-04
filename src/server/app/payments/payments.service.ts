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

    constructor() {
        super();
    }

    // #region Private

    private async createCharge(source: string, amount: number, userId: number | null = null,
        customerId: string | null = null, email: string | null = null) {
        const stripeAccount = new stripe(environment.stripe.secretKey);

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
            return await stripeAccount.charges.create(chargeCreationOptions);
        } catch (error) {
            const errorMessage = 'Error creating charge';
            logger.error(errorMessage, [error, chargeCreationOptions]);
            throw new Error(errorMessage);
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
                const newCard = await stripeAccount.customers.createSource(user.stripeCustomerId, {
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
        const stripeAccount = new stripe(environment.stripe.secretKey);

        try {
            return await stripeAccount.tokens.retrieve(token);
        } catch (error) {
            const errorMessage = 'Error getting Stripe card details';
            logger.error(errorMessage, [error, token]);
            throw new Error(errorMessage);
        }
    }

    // #endregion

    async anonymousPayment(res: Response, token: string, amount: number, email: string): Promise<boolean> {
        const charge = await this.createCharge(token, amount, null, null, email);

        emailBroker.paymentSuccessful({
            email,
            amount
        });

        return await paymentsRepository.anonymousPayment(res, charge.metadata.paymentUId, charge.id, charge.created, amount, email);
    }

    async userPayment(res: Response, cardUId: string, token: string | null, amount: number, saveCard: boolean): Promise<boolean> {
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
            throw new Error('User required');
        }

        return (await this.createStripeCard(res, user, token)).card;
    }

    async deleteCard(res: Response, uId: string): Promise<boolean> {
        const userId = this.getUserId(res);
        const user = await usersRepository.getUserById(res, userId);

        if (!user) {
            throw new Error('User required');
        }

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.paymentCards.find(userCard => userCard.uId === uId);

        if (card && (!card.isDefault || user.paymentCards.length === 1)) {
            try {
                const deleteConfirmation = await stripeAccount.customers.deleteCard(user.stripeCustomerId, card.stripeCardId);
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
            throw new Error('User required');
        }

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.paymentCards.find(userCard => userCard.uId === uId);

        if (!card) {
            const errorMessage = 'User default card could not be found';
            logger.error(errorMessage, [userId, uId, user]);
            throw new Error(errorMessage);
        }

        try {
            const updatedCustomer = await stripeAccount.customers.update(user.stripeCustomerId,
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
}

export const paymentsService = new PaymentsService();
