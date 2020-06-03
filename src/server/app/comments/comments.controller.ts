import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { DEFAULT_PAGE_SIZE, ServerValidator, Validators } from '@shared/validation/validators';
import { CreateOrUpdateCommentViewModel } from '@shared/view-models/item/create-or-update-comment.view-model';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../shared/base-controller';
import { commentsService } from './comments.service';

class CommentsController extends BaseController {

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
            await commentsService.create(res, uId as string, viewModel.description, viewModel.commentUId || null)
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
            await commentsService.update(res, uId as string, viewModel.description)
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await commentsService.delete(res, uId as string)
        );
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await commentsService.get(res, req.ip, uId as string)
        );
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : DEFAULT_PAGE_SIZE;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await commentsService.getAll(res, uId as string, pageIndex, pageSize)
        );
    }

    async getReplies(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : DEFAULT_PAGE_SIZE;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await commentsService.getReplies(res, uId as string, pageIndex, pageSize)
        );
    }
}

export const commentsController = new CommentsController();
