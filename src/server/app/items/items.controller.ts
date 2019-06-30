import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, ServerValidator, Validators } from '../../../shared/validation/validators';
import { CreateOrUpdateCommentViewModel } from '../../../shared/view-models/item/create-or-update-comment.view-model';
import { CreateOrUpdateItemViewModel } from '../../../shared/view-models/item/create-or-update-item.view-model';
import { SearchViewModel } from '../../../shared/view-models/item/search.view-model';
import { BaseController } from '../shared/base-controller';
import { itemsService } from './items.service';

class ItemsController extends BaseController {

    constructor() {
        super();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateOrUpdateItemViewModel;

        const formGroup = BuildFormGroup.createOrUpdateItem(viewModel.title, viewModel.description, viewModel.media);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await itemsService.create(res, viewModel.title, viewModel.description, viewModel.media)
        );
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const viewModel = req.body as CreateOrUpdateItemViewModel;

        const formGroup = BuildFormGroup.createOrUpdateItem(viewModel.title, viewModel.description, viewModel.media);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.update(res, uId as string, viewModel.title, viewModel.description, viewModel.media)
        );
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.get(res, req.ip, uId as string)
        );
    }

    async getItems(req: Request, res: Response, next: NextFunction) {
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : null || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await itemsService.getItems(res, pageIndex, pageSize)
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.delete(res, uId as string)
        );
    }

    async createFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.createFavourite(res, uId as string)
        );
    }

    async deleteFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.deleteFavourite(res, uId as string)
        );
    }

    async getFavourites(req: Request, res: Response, next: NextFunction) {
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : null || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await itemsService.getFavourites(res, pageIndex, pageSize)
        );
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = BuildFormGroup.createOrUpdateComment(viewModel.description);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || !!Validators.required(uId);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await itemsService.createComment(res, uId as string, viewModel.description)
        );
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = BuildFormGroup.createOrUpdateComment(viewModel.description);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.updateComment(res, uId as string, viewModel.description)
        );
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.deleteComment(res, uId as string)
        );
    }

    async getComments(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : null || this.DEFAULT_PAGE_SIZE;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.getComments(res, uId as string, pageIndex, pageSize)
        );
    }

    async getComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error('UId is required');
        }

        res.status(200).json(
            await itemsService.getComment(res, req.ip, uId as string)
        );
    }

    async search(req: Request, res: Response, next: NextFunction) {
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : null || this.DEFAULT_PAGE_SIZE;
        const viewModel = req.body as SearchViewModel;

        const formGroup = BuildFormGroup.search(viewModel.term);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.search(res, viewModel.term, pageIndex, pageSize)
        );
    }
}

export const itemsController = new ItemsController();
