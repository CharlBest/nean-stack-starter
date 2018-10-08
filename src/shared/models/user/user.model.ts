import { CardModel } from '../payment/card.model';
import { NotificationPreferencesModel } from './notification-preferences.model';
import { UserLiteModel } from './user-lite.model';

export class UserModel extends UserLiteModel implements NotificationPreferencesModel {
    dateCreated: number;
    isVerified: boolean;
    views: number;
    bio: string;
    avatarUrl: string;
    emailVerified: boolean;
    emailVerifiedDateCreated: number;
    forgotPasswordCodes: Array<string>;
    userCards: CardModel[];
    pushSubscription: [string, string, string];

    // TODO: user role/permission

    // Notification Types
    nt1: boolean;
    nt2: boolean;
}
