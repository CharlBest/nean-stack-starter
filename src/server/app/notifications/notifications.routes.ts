import { NotificationRoutes } from '@shared/routes/notification.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { notificationsController } from './notifications.controller';

class NotificationsRoutes extends BaseRoute {

    constructor() {
        super();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(NotificationRoutes.getNotificationPreferences().server(), Authentication.loginRequired,
            async (req, res, next) => notificationsController.getNotificationPreferences(req, res, next).catch(next));
        this.router.put(NotificationRoutes.updateNotificationPreferences().server(), Authentication.loginRequired,
            async (req, res, next) => notificationsController.updateNotificationPreferences(req, res, next).catch(next));

        this.router.post(NotificationRoutes.createSubscription().server(), Authentication.loginRequired,
            async (req, res, next) => notificationsController.createSubscription(req, res, next).catch(next));
        this.router.delete(NotificationRoutes.deleteSubscription().server(), Authentication.loginRequired,
            async (req, res, next) => notificationsController.deleteSubscription(req, res, next).catch(next));
        this.router.get(NotificationRoutes.getSubscriptions().server(), Authentication.loginRequired,
            async (req, res, next) => notificationsController.getSubscriptions(req, res, next).catch(next));
    }
}

export const notificationsRoutes = new NotificationsRoutes().router;
