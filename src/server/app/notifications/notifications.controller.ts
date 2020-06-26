import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { DEFAULT_PAGE_SIZE, ServerValidator, Validators } from '@shared/validation/validators';
import { UpdateNotificationPreferencesViewModel } from '@shared/view-models/user/update-notification-preferences.view-model';
import { NextFunction, Request, Response } from 'express';
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

        // TODO: this will break if body is empty because access properties on empty preferences object
        // Solution: wait for elvis operator to land in Typescript 3.7 rather than if else shorthand syntax
        const formGroup = FormGroupBuilder.updateNotificationPreferences(
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
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await notificationsService.createSubscription(res, uId as string)
        );
    }

    async deleteSubscription(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await notificationsService.deleteSubscription(res, uId as string)
        );
    }

    async getSubscriptions(req: Request, res: Response, next: NextFunction) {
        const tags = req.query.tags && req.query.tags !== '' ? (req.query.tags as string).split(',') : null;
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await notificationsService.getSubscriptions(res, tags, pageIndex, pageSize)
        );
    }
}

export const notificationsController = new NotificationsController();
