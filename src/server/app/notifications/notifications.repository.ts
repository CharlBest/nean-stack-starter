import { Response } from 'express';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { NotificationPreferencesViewModel } from '../../../shared/view-models/user/notification-preferences.view-model';
import { NotificationsViewModel } from '../../../shared/view-models/user/notifications.view-model';
import { PushSubscriptionViewModel } from '../../../shared/view-models/user/push-subscription.view-model';
import { UpdateNotificationPreferencesViewModel } from '../../../shared/view-models/user/update-notification-preferences.view-model';
import { Database } from '../../core/database';
import { PushNotificationModel } from '../../worker/communication/push-notification.model';
import { BaseRepository } from '../shared/base-repository';

class NotificationsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async getNotificationPreferences(res: Response, userId: number): Promise<NotificationPreferencesViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.notifications.getNotificationPreferences,
            {
                userId
            }
        );

        const model = result.records.map(x => {
            const localModel = new NotificationPreferencesViewModel(x.get('pushNotificationTypes'), x.get('emailNotificationTypes'));
            localModel.hasPushSubscription = x.get('hasPushSubscription');
            localModel.pushNotificationEnabled = x.get('pushNotificationEnabled');
            localModel.emailEnabled = x.get('emailEnabled');
            localModel.autoSubscribeToItem = x.get('autoSubscribeToItem');
            return localModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async updateNotificationPreferences(res: Response, userId: number, viewModel: UpdateNotificationPreferencesViewModel)
        : Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.notifications.updateNotificationPreferences,
            {
                userId,
                pushSubscription: viewModel.pushSubscription ? PushSubscriptionViewModel.createArray(
                    viewModel.pushSubscription.endpoint,
                    viewModel.pushSubscription.keys.auth,
                    viewModel.pushSubscription.keys.p256dh) : null,
                pushNotificationEnabled: viewModel.notificationPreferences.pushNotificationEnabled,
                emailEnabled: viewModel.notificationPreferences.emailEnabled,
                autoSubscribeToItem: viewModel.notificationPreferences.autoSubscribeToItem,
                pushNotificationTypes: NotificationsViewModel.createPushNotificationArray(
                    viewModel.notificationPreferences.pushNewComment,
                    viewModel.notificationPreferences.pushHot
                ),
                emailNotificationTypes: NotificationsViewModel.createEmailNotificationArray(
                    viewModel.notificationPreferences.emailNewComment,
                    viewModel.notificationPreferences.emailHot
                ),
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async createSubscription(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.notifications.createSubscription,
            {
                userId,
                uId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async deleteSubscription(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.notifications.deleteSubscription,
            {
                userId,
                uId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async getSubscriptions(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.notifications.getSubscriptions,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(x => {
            let viewModel = new ItemViewModel();
            viewModel = x.get('items');
            viewModel.user = x.get('users');
            viewModel.subscribed = true;
            return viewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async getNewCommentNotification(res: Response, commentUId: string): Promise<PushNotificationModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.notifications.getNewCommentNotification,
            {
                commentUId
            }
        );

        const model = (<any>result).records.map((x: any) => {
            const viewModel = new PushNotificationModel();

            const pushSubscriptions = x.get('pushSubscriptions');
            if (pushSubscriptions && pushSubscriptions.length > 0) {
                viewModel.pushSubscriptions = pushSubscriptions.map((y: any) => PushSubscriptionViewModel.createFromArray(y));
            }

            viewModel.body = x.get('description');
            return viewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }
}

export const notificationsRepository = new NotificationsRepository();
