import { PushSubscriptionValues } from '@shared/models/user/user.model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { NotificationPreferencesViewModel } from '@shared/view-models/user/notification-preferences.view-model';
import { NotificationsViewModel } from '@shared/view-models/user/notifications.view-model';
import { PushSubscriptionViewModel } from '@shared/view-models/user/push-subscription.view-model';
import { UpdateNotificationPreferencesViewModel } from '@shared/view-models/user/update-notification-preferences.view-model';
import { Response } from 'express';
import { Database } from '../../core/database';
import { PushNotificationModel } from '../../worker/communication/push-notification.model';
import { BaseRepository } from '../shared/base-repository';

class NotificationsRepository extends BaseRepository {

    constructor() {
        super();
    }

    async getNotificationPreferences(res: Response, userId: number): Promise<NotificationPreferencesViewModel | null> {
        const result = await this.run(res, Database.queries.notifications.getNotificationPreferences,
            {
                userId
            }
        );

        const model = result ? result.map(record => {
            const localModel = new NotificationPreferencesViewModel(
                record.get('pushNotificationTypes'), record.get('emailNotificationTypes'));
            localModel.hasPushSubscription = record.get('hasPushSubscription');
            localModel.pushNotificationEnabled = record.get('pushNotificationEnabled');
            localModel.emailEnabled = record.get('emailEnabled');
            localModel.autoSubscribeToItem = record.get('autoSubscribeToItem');
            return localModel;
        }) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async updateNotificationPreferences(res: Response, userId: number, viewModel: UpdateNotificationPreferencesViewModel)
        : Promise<boolean> {
        const result = await this.run(res, Database.queries.notifications.updateNotificationPreferences,
            {
                userId,
                pushSubscription: viewModel.pushSubscription ? PushSubscriptionViewModel.createArray(
                    viewModel.pushSubscription.endpoint,
                    viewModel.pushSubscription.keys.auth,
                    viewModel.pushSubscription.keys.p256dh) : null,
                pushNotificationEnabled: viewModel.preferences.pushNotificationEnabled,
                emailEnabled: viewModel.preferences.emailEnabled,
                autoSubscribeToItem: viewModel.preferences.autoSubscribeToItem,
                pushNotificationTypes: NotificationsViewModel.createPushNotificationArray(
                    viewModel.preferences.pushNewComment,
                    viewModel.preferences.pushHot
                ),
                emailNotificationTypes: NotificationsViewModel.createEmailNotificationArray(
                    viewModel.preferences.emailNewComment,
                    viewModel.preferences.emailHot
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
        const result = await this.run(res, Database.queries.notifications.createSubscription,
            {
                userId,
                uId
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async deleteSubscription(res: Response, userId: number, uId: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.notifications.deleteSubscription,
            {
                userId,
                uId
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async getSubscriptions(res: Response, userId: number, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await this.run(res, Database.queries.notifications.getSubscriptions,
            {
                userId,
                pageIndex,
                pageSize
            }
        );

        const model = result ? result.map(record => {
            return {
                ...record.get('items'),
                files: record.get('files'),
                tags: record.get('tags'),
                user: record.get('users'),
                subscribed: true,
            } as ItemViewModel;
        }) : null;

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async getNewCommentNotification(res: Response, commentUId: string): Promise<PushNotificationModel | null> {
        const result = await this.run(res, Database.queries.notifications.getNewCommentNotification,
            {
                commentUId
            }
        );

        const model = result ? result.map(record => {
            const viewModel = new PushNotificationModel();

            const pushSubscriptions = record.get('pushSubscriptions');
            if (pushSubscriptions && pushSubscriptions.length > 0) {
                viewModel.pushSubscriptions = pushSubscriptions
                    .map((pushNotification: PushSubscriptionValues) => PushSubscriptionViewModel.createFromArray(pushNotification));
            }

            viewModel.body = record.get('description');
            return viewModel;
        }) : null;

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }
}

export const notificationsRepository = new NotificationsRepository();
