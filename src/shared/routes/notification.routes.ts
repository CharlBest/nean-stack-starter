import { BaseRoute } from './base.route';

export class NotificationRoutes {

    private static root = 'notification';

    static getNotificationPreferences = () => new BaseRoute(NotificationRoutes.root, 'getNotificationPreferences');
    static updateNotificationPreferences = () => new BaseRoute(NotificationRoutes.root, 'updateNotificationPreferences');
    static createSubscription = (uId?: string) => new BaseRoute(NotificationRoutes.root, 'createSubscription', { uId });
    static deleteSubscription = (uId?: string) => new BaseRoute(NotificationRoutes.root, 'deleteSubscription', { uId });
    static getSubscriptions = () => new BaseRoute(NotificationRoutes.root, 'getSubscriptions');
}
