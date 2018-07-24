import { UserCardModel } from './user-card.model';
import { UserLiteModel } from './user-lite.model';

export class UserModel extends UserLiteModel {
    dateCreated: number;
    isVerified: boolean;
    views: number;
    bio: string;
    avatarUrl: string;
    emailVerified: boolean;
    emailVerifiedDateCreated: number;
    forgotPasswordCodes: string[];
    stripeCustomerId: string;
    userCards: UserCardModel[];

    // TODO: user role/permission
}
