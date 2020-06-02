import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ServerValidator, Validators } from '@shared/validation/validators';
import { CreateOrUpdateCommentViewModel } from '@shared/view-models/item/create-or-update-comment.view-model';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../shared/base-controller';
import { repliesService } from './replies.service';

class RepliesController extends BaseController {

    constructor() {
        super();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = FormGroupBuilder.createOrUpdateComment(viewModel.description);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || !!Validators.required(uId);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await repliesService.create(res, uId as string, viewModel.description)
        );
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = FormGroupBuilder.createOrUpdateComment(viewModel.description);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await repliesService.update(res, uId as string, viewModel.description)
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await repliesService.delete(res, uId as string)
        );
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await repliesService.get(res, req.ip, uId as string)
        );
    }


    async getAll(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : null || this.DEFAULT_PAGE_SIZE;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await repliesService.getAll(res, uId as string, pageIndex, pageSize)
        );
    }
}

export const repliesController = new RepliesController();
