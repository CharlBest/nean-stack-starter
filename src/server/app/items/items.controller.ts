import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, ServerValidator, Validators } from '../../../shared/validation/validators';
import { CreateOrUpdateCommentViewModel } from '../../../shared/view-models/item/create-or-update-comment.view-model';
import { CreateOrUpdateItemViewModel } from '../../../shared/view-models/item/create-or-update-item.view-model';
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
        const uId = req.params.uId as string;
        const viewModel = req.body as CreateOrUpdateItemViewModel;

        const formGroup = BuildFormGroup.createOrUpdateItem(viewModel.title, viewModel.description, viewModel.media);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.update(res, uId, viewModel.title, viewModel.description, viewModel.media)
        );
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.get(res, req.ip, uId)
        );
    }

    async getItems(req: Request, res: Response, next: NextFunction) {
        const pageIndex = +req.query.pageIndex || 0;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await itemsService.getItems(res, pageIndex, pageSize)
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.delete(res, uId)
        );
    }

    async createFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.createFavourite(res, uId)
        );
    }

    async deleteFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.deleteFavourite(res, uId)
        );
    }

    async getFavourites(req: Request, res: Response, next: NextFunction) {
        const pageIndex = +req.query.pageIndex || 0;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await itemsService.getFavourites(res, pageIndex, pageSize)
        );
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = BuildFormGroup.createOrUpdateComment(viewModel.description);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await itemsService.createComment(res, uId, viewModel.description)
        );
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = BuildFormGroup.createOrUpdateComment(viewModel.description);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.updateComment(res, uId, viewModel.description)
        );
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.deleteComment(res, uId)
        );
    }

    async getComments(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;
        const pageIndex = +req.query.pageIndex || 0;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.getComments(res, uId, pageIndex, pageSize)
        );
    }

    async getComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await itemsService.getComment(res, req.ip, uId)
        );
    }
}

export const itemsController = new ItemsController();
