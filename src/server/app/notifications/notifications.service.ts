import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { NotificationPreferencesViewModel } from '@shared/view-models/user/notification-preferences.view-model';
import { UpdateNotificationPreferencesViewModel } from '@shared/view-models/user/update-notification-preferences.view-model';
import { Response } from 'express';
import { PushNotificationModel } from '../../worker/communication/push-notification.model';
import { BaseService } from '../shared/base-service';
import { notificationsRepository } from './notifications.repository';

class NotificationsService extends BaseService {

    constructor() {
        super();
    }

    async getNotificationPreferences(res: Response): Promise<NotificationPreferencesViewModel | null> {
        return await notificationsRepository.getNotificationPreferences(res, this.getUserId(res));
    }

    async updateNotificationPreferences(res: Response, viewModel: UpdateNotificationPreferencesViewModel): Promise<boolean> {
        return await notificationsRepository.updateNotificationPreferences(res, this.getUserId(res), viewModel);
    }

    async createSubscription(res: Response, uId: string): Promise<boolean> {
        return await notificationsRepository.createSubscription(res, this.getUserId(res), uId);
    }

    async deleteSubscription(res: Response, uId: string): Promise<boolean> {
        return await notificationsRepository.deleteSubscription(res, this.getUserId(res), uId);
    }

    async getSubscriptions(res: Response, tags: Array<string> | null, pageIndex: number, pageSize: number)
        : Promise<ItemViewModel[] | null> {
        return await notificationsRepository.getSubscriptions(res, this.getUserId(res), tags, pageIndex, pageSize);
    }

    async getNewCommentNotification(res: Response, commentUId: string, title: string): Promise<PushNotificationModel[] | null> {
        return await notificationsRepository.getNewCommentNotification(res, commentUId, title);
    }
}

export const notificationsService = new NotificationsService();
