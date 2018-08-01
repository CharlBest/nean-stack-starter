import { Response } from 'express';
import * as stripe from 'stripe';
import { v4 as nodeUUId } from 'uuid';
import { UserCardModel } from '../../../shared/models/user/user-card.model';
import { UserLiteModel } from '../../../shared/models/user/user-lite.model';
import { ServerValidator } from '../../../shared/validation/validators';
import { ValidationUtil } from '../../core/utils/validation-util';
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

    public async anonymousPayment(res: Response, token: string, amount: number): Promise<boolean> {
        const stripeAccount = new stripe(environment.stripe.secretKey);
        const paymentUId = nodeUUId();

        try {
            const charge = await stripeAccount.charges.create({
                amount: amount * 100,
                currency: 'EUR',
                description: 'NEAN donation',
                source: token,
                metadata: {
                    paymentUId
                },
            });

            return await this.paymentsRepository.anonymousPayment(res, paymentUId, charge.id, charge.created, token, amount);
        } catch {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }
    }

    public async userPayment(res: Response, cardUId: string, token: string, amount: number, saveCard: boolean): Promise<boolean> {
        const stripeAccount = new stripe(environment.stripe.secretKey);

        async function createCharge(source: string, userId: number, customerId: string = null) {
            const paymentUId = nodeUUId();
            const metadata = {
                userId,
                paymentUId
            };
            const chargeCreationOptions = {
                amount: amount * 100,
                currency: 'EUR',
                description: 'NEAN donation',
                source: source,
                metadata
            };
            if (customerId !== null) {
                chargeCreationOptions['customer'] = customerId;
            }

            try {
                return await stripeAccount.charges.create(chargeCreationOptions);
            } catch {
                ServerValidator.addGlobalError(res, 'error', true);
                throw ValidationUtil.errorResponse(res);
            }
        }

        const user = await this.usersRepository.getUserById(res, this.getUserId(res));

        if (user === null) {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }

        const selectedCard = user.userCards.find(x => x.uId === cardUId);
        if (selectedCard) {
            // Existing customer and card
            const charge = await createCharge(selectedCard.stripeCardId, user.id, user.stripeCustomerId);

            return await this.paymentsRepository.userPayment(res, this.getUserId(res), selectedCard.uId, charge.metadata.paymentUId, amount, charge.id, charge.created);
        } else {
            // New card
            if (saveCard) {
                // Save card
                const newCard = await this.createStripeCard(res, user, token);

                const charge = await createCharge(newCard.card.stripeCardId, user.id, newCard.stripeCustomerId);

                return await this.paymentsRepository.userPayment(res, this.getUserId(res), newCard.card.uId, charge.metadata.paymentUId, amount, charge.id, charge.created);
            } else {
                const charge = await createCharge(token, user.id);

                return await this.paymentsRepository.userPayment(res, this.getUserId(res), null, charge.metadata.paymentUId, amount, charge.id, charge.created);
            }
        }
    }

    private async createStripeCard(res: Response, user: UserLiteModel, token: string): Promise<{ card: UserCardModel, stripeCustomerId: string }> {
        const stripeAccount = new stripe(environment.stripe.secretKey);

        try {
            if (user.stripeCustomerId === null) {
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

                const card = await this.paymentsRepository.createCard(res, this.getUserId(res), customer.id, nodeUUId(),
                    (<stripe.cards.ICard>retrievedCustomer.default_source).id, (<stripe.cards.ICard>retrievedCustomer.default_source).brand,
                    (<stripe.cards.ICard>retrievedCustomer.default_source).last4);

                return {
                    card,
                    stripeCustomerId: customer.id
                };
            } else {
                const newCard = await stripeAccount.customers.createSource(user.stripeCustomerId, {
                    source: token
                }) as stripe.ICard;

                const card = await this.paymentsRepository.createCard(res, this.getUserId(res), null, nodeUUId(), newCard.id, newCard.brand, newCard.last4);

                return {
                    card,
                    stripeCustomerId: null
                };
            }
        } catch (error) {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }
    }

    public async userCards(res: Response): Promise<UserCardModel[]> {
        return await this.paymentsRepository.userCards(res, this.getUserId(res));
    }

    public async createCard(res: Response, token: string): Promise<UserCardModel> {
        const user = await this.usersRepository.getLiteUserById(res, this.getUserId(res));

        return (await this.createStripeCard(res, user, token)).card;
    }

    public async deleteCard(res: Response, uId: string): Promise<boolean> {
        const user = await this.usersRepository.getUserById(res, this.getUserId(res));

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.userCards.find(x => x.uId === uId);

        if (card && (!card.isDefault || user.userCards.length === 1)) {
            try {
                const deleteConfirmation = await stripeAccount.customers.deleteCard(user.stripeCustomerId, card.stripeCardId);
                if (deleteConfirmation.deleted) {
                    return await this.paymentsRepository.deleteCard(res, this.getUserId(res), card.uId);
                } else {
                    ServerValidator.addGlobalError(res, 'error', true);
                    throw ValidationUtil.errorResponse(res);
                }
            } catch {
                ServerValidator.addGlobalError(res, 'error', true);
                throw ValidationUtil.errorResponse(res);
            }
        } else {
            ServerValidator.addGlobalError(res, 'error', true);
            throw ValidationUtil.errorResponse(res);
        }
    }

    public async updateDefaultCard(res: Response, uId: string): Promise<boolean> {
        const user = await this.usersRepository.getUserById(res, this.getUserId(res));

        const stripeAccount = new stripe(environment.stripe.secretKey);
        const card = user.userCards.find(x => x.uId === uId);

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

    public async userPaymentHistory(res: Response): Promise<boolean> {
        return true;
    }
}
