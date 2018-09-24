import { Response } from 'express';
import * as stripe from 'stripe';
import { v4 as nodeUUId } from 'uuid';
import { CardModel } from '../../../shared/models/payment/card.model';
import { PaymentModel } from '../../../shared/models/payment/payment.model';
import { UserLiteModel } from '../../../shared/models/user/user-lite.model';
import { ServerValidator } from '../../../shared/validation/validators';
import { ValidationUtil } from '../../core/utils/validation-util';
import { Emailer } from '../../email/emailer';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/base-service';
import { UsersRepository } from '../users/users.repository';
import { PaymentsRepository } from './payments.repository';

export class PaymentsService extends BaseService {

    private paymentsRepository: PaymentsRepository;
    private usersRepository: UsersRepository;

    constructor() {
        super();
        this.paymentsRepository = new PaymentsRepository();
        this.usersRepository = new UsersRepository();
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
            ServerValidator.addGlobalError(res, 'error', error);
            throw ValidationUtil.errorResponse(res);
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

                const card = await this.paymentsRepository.createCard(
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
                    ServerValidator.addGlobalError(res, 'card', { required: true });
                    throw ValidationUtil.errorResponse(res);
                }

                return {
                    card,
                    stripeCustomerId: customer.id
                };
            } else {
                const newCard = await stripeAccount.customers.createSource(user.stripeCustomerId, {
                    source: token
                }) as stripe.ICard;

                const card = await this.paymentsRepository.createCard(res, this.getUserId(res), user.stripeCustomerId,
                    nodeUUId(), newCard.id, newCard.fingerprint, newCard.brand, newCard.last4, +newCard.exp_month, +newCard.exp_year);

                if (!card) {
                    ServerValidator.addGlobalError(res, 'card', { required: true });
                    throw ValidationUtil.errorResponse(res);
                }

                return {
                    card,
                    stripeCustomerId: user.stripeCustomerId
                };
            }
        } catch (error) {
            ServerValidator.addGlobalError(res, 'error', error);
            throw ValidationUtil.errorResponse(res);
        }
    }

    private async getStripeCardDetails(res: Response, token: string): Promise<stripe.tokens.IToken> {
        const stripeAccount = new stripe(environment.stripe.secretKey);

        try {
            return await stripeAccount.tokens.retrieve(token);
        } catch (error) {
            ServerValidator.addGlobalError(res, 'error', error);
            throw ValidationUtil.errorResponse(res);
        }
    }

    // #endregion

    async anonymousPayment(res: Response, token: string, amount: number, email: string): Promise<boolean> {
        const charge = await this.createCharge(res, token, amount);

        Emailer.paymentSuccessfulEmail(email, amount);

        return await this.paymentsRepository.anonymousPayment(res, charge.metadata.paymentUId, charge.id, charge.created, amount, email);
    }

    async userPayment(res: Response, cardUId: string, token: string, amount: number, saveCard: boolean): Promise<boolean> {
        const user = await this.usersRepository.getUserById(res, this.getUserId(res));

        if (!user) {
            ServerValidator.addGlobalError(res, 'error', 'User not found');
            throw ValidationUtil.errorResponse(res);
        }

        const selectedCard = user.userCards.find(x => x.uId === cardUId);
        if (selectedCard) {
            // Existing customer and card
            const charge = await this.createCharge(res, selectedCard.stripeCardId, amount, user.id, user.stripeCustomerId);

            Emailer.paymentSuccessfulEmail(user.email, amount);

            return await this.paymentsRepository.userPayment(res, this.getUserId(res), selectedCard.uId,
                charge.metadata.paymentUId, amount, charge.id, charge.created);
        } else {
            // New card
            if (saveCard) {
                const cardDetails = await this.getStripeCardDetails(res, token);

                // TODO: check expire date
                const existingCard = user.userCards
                    .find(x => cardDetails.card ? x.stripeFingerprint === cardDetails.card.fingerprint : false);

                if (existingCard) {
                    const charge = await this.createCharge(res, existingCard.stripeCardId, amount, user.id, user.stripeCustomerId);

                    Emailer.paymentSuccessfulEmail(user.email, amount);

                    return await this.paymentsRepository.userPayment(res, this.getUserId(res), existingCard.uId,
                        charge.metadata.paymentUId, amount, charge.id, charge.created);
                } else {
                    const newCard = await this.createStripeCard(res, user, token);

                    const charge = await this.createCharge(res, newCard.card.stripeCardId, amount, user.id, newCard.stripeCustomerId);

                    Emailer.paymentSuccessfulEmail(user.email, amount);

                    return await this.paymentsRepository.userPayment(res, this.getUserId(res), newCard.card.uId,
                        charge.metadata.paymentUId, amount, charge.id, charge.created);
                }
            } else {
                // TODO: This could be associated with a stripe customer but don't know how without saving the card which I don't want to do
                const charge = await this.createCharge(res, token, amount, user.id);

                Emailer.paymentSuccessfulEmail(user.email, amount);

                return await this.paymentsRepository.userPayment(res, this.getUserId(res), null,
                    charge.metadata.paymentUId, amount, charge.id, charge.created);
            }
        }
    }

    async userCards(res: Response): Promise<CardModel[] | null> {
        return await this.paymentsRepository.userCards(res, this.getUserId(res));
    }

    async createCard(res: Response, token: string): Promise<CardModel> {
        const user = await this.usersRepository.getLiteUserById(res, this.getUserId(res));

        if (!user) {
            ServerValidator.addGlobalError(res, 'user', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return (await this.createStripeCard(res, user, token)).card;
    }

    async deleteCard(res: Response, uId: string): Promise<boolean> {
        const user = await this.usersRepository.getUserById(res, this.getUserId(res));

        if (!user) {
            ServerValidator.addGlobalError(res, 'user', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.userCards.find(x => x.uId === uId);

        if (card && (!card.isDefault || user.userCards.length === 1)) {
            try {
                const deleteConfirmation = await stripeAccount.customers.deleteCard(user.stripeCustomerId, card.stripeCardId);
                if (deleteConfirmation.deleted) {
                    return await this.paymentsRepository.deleteCard(res, this.getUserId(res), card.uId);
                } else {
                    ServerValidator.addGlobalError(res, 'error', 'Stripe failed deleting card');
                    throw ValidationUtil.errorResponse(res);
                }
            } catch {
                ServerValidator.addGlobalError(res, 'error', 'Stripe error while deleting card');
                throw ValidationUtil.errorResponse(res);
            }
        } else {
            ServerValidator.addGlobalError(res, 'error', 'Cannot delete card');
            throw ValidationUtil.errorResponse(res);
        }
    }

    async updateDefaultCard(res: Response, uId: string): Promise<boolean> {
        const user = await this.usersRepository.getUserById(res, this.getUserId(res));

        if (!user) {
            ServerValidator.addGlobalError(res, 'user', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.userCards.find(x => x.uId === uId);

        if (!card) {
            ServerValidator.addGlobalError(res, 'user deafult card', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        try {
            const updatedCustomer = await stripeAccount.customers.update(user.stripeCustomerId,
                {
                    default_source: card.stripeCardId
                });

            return await this.paymentsRepository.updateDefaultCard(res, this.getUserId(res), card.uId);
        } catch (error) {
            ServerValidator.addGlobalError(res, 'error', error);
            throw ValidationUtil.errorResponse(res);
        }
    }

    async paymentHistory(res: Response): Promise<PaymentModel[] | null> {
        return await this.paymentsRepository.paymentHistory(res, this.getUserId(res));
    }
}
