import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, ServerValidator, Validators } from '../../../shared/validation/validators';
import { UpdateNotificationPreferencesViewModel } from '../../../shared/view-models/user/update-notification-preferences.view-model';
import { BaseController } from '../shared/base-controller';
import { notificationsService } from './notifications.service';

class NotificationsController extends BaseController {

    constructor() {
        super();
    }

    async getNotificationPreferences(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await notificationsService.getNotificationPreferences(res)
        );
    }

    async updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as UpdateNotificationPreferencesViewModel;

        const formGroup = BuildFormGroup.updateNotificationPreferences(
            viewModel.preferences.pushNotificationEnabled,
            viewModel.preferences.emailEnabled,
            viewModel.preferences.autoSubscribeToItem,
            viewModel.preferences.pushNewComment,
            viewModel.preferences.pushHot,
            viewModel.preferences.emailNewComment,
            viewModel.preferences.emailHot);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error('All notification types are required');
        }

        res.status(200).json(
            await notificationsService.updateNotificationPreferences(res, viewModel)
        );
    }

    async createSubscription(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await notificationsService.createSubscription(res, uId!)
        );
    }

    async deleteSubscription(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await notificationsService.deleteSubscription(res, uId!)
        );
    }

    async getSubscriptions(req: Request, res: Response, next: NextFunction) {
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : null || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await notificationsService.getSubscriptions(res, pageIndex, pageSize)
        );
    }
}

export const notificationsController = new NotificationsController();
