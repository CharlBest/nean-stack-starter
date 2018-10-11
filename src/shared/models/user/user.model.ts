import { CardModel } from '../payment/card.model';
import { UserLiteModel } from './user-lite.model';

export class UserModel extends UserLiteModel {
    dateCreated: number;
    isVerified: boolean;
    views: number;
    bio: string;
    avatarUrl: string;
    emailVerified: boolean;
    emailVerifiedDateCreated: number;
    forgotPasswordCodes: Array<string>;
    userCards: CardModel[];
    pushSubscription: PushSubscriptionValues;
    pushNotificationTypes: PushNotificationTypes;
    emailNotificationTypes: EmailNotificationTypes;
    itemCount: number;
    itemCommentCount: number;
    itemFavouriteCount: number;

    // TODO: user role/permission
}

export type NotificationType = boolean | null;
export type PushNotificationTypes = [NotificationType, NotificationType];
export type EmailNotificationTypes = [NotificationType, NotificationType];
export type PushSubscriptionValues = [string, string, string];
