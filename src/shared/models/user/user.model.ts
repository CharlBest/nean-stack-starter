import { UserLiteModel } from './user-lite.model';

export class UserModel extends UserLiteModel {
    dateCreated: number;
    isVerified: boolean;
    views: number;
    bio: string;
    emailVerified: boolean;
    emailVerifiedDateCreated: number;
    forgotPasswordCodes: Array<string>;
    pushSubscription: PushSubscriptionValues;
    pushNotificationTypes: PushNotificationTypes;
    emailNotificationTypes: EmailNotificationTypes;
    itemCount: number;
    commentCount: number;
    favouriteCount: number;
    subscriptionCount: number;

    // TODO: user role/permission
}

export type NotificationType = boolean | null;
export type PushNotificationTypes = [NotificationType, NotificationType];
export type EmailNotificationTypes = [NotificationType, NotificationType];
export type PushSubscriptionValues = [string, string, string];
