import { UserCardModel } from './user-card.model';
import { UserModel } from './user.model';

export class UserPaymentDetailsModel {
    user: UserModel;
    userCards: UserCardModel[];
}
