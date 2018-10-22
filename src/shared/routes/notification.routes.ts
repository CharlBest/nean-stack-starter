import { BaseRoute } from './base.route';

export class NotificationRoutes {

    private static rootRoute = 'notification';

    static getNotificationPreferences = () => new BaseRoute(NotificationRoutes.rootRoute, 'getNotificationPreferences');
    static updateNotificationPreferences = () => new BaseRoute(NotificationRoutes.rootRoute, 'updateNotificationPreferences');
    static createSubscription = (uId?: string) => new BaseRoute(NotificationRoutes.rootRoute, 'createSubscription', { uId });
    static deleteSubscription = (uId?: string) => new BaseRoute(NotificationRoutes.rootRoute, 'deleteSubscription', { uId });
    static getSubscriptions = () => new BaseRoute(NotificationRoutes.rootRoute, 'getSubscriptions');
}
