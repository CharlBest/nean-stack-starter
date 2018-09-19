import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, ServerValidator, Validators } from '../../../shared/validation/validators';
import { CreateOrUpdateCommentViewModel } from '../../../shared/view-models/item/create-or-update-comment.view-model';
import { CreateOrUpdateItemViewModel } from '../../../shared/view-models/item/create-or-update-item.view-model';
import { ValidationUtil } from '../../core/utils/validation-util';
import { BaseController } from '../shared/base-controller';
import { ItemsService } from './items.service';

export class ItemsController extends BaseController {
    private itemsService: ItemsService;

    constructor() {
        super();
        this.itemsService = new ItemsService();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateOrUpdateItemViewModel;

        const formGroup = BuildFormGroup.createOrUpdateItem(viewModel.title, viewModel.description, viewModel.media);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(201).json(
            await this.itemsService.create(res, viewModel.title, viewModel.description, viewModel.media)
        );
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;
        const viewModel = req.body as CreateOrUpdateItemViewModel;

        const formGroup = BuildFormGroup.createOrUpdateItem(viewModel.title, viewModel.description, viewModel.media);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.update(res, uId, viewModel.title, viewModel.description, viewModel.media)
        );
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.get(res, req.ip, uId)
        );
    }

    async getItems(req: Request, res: Response, next: NextFunction) {
        const pageIndex = +req.query.pageIndex || 0;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await this.itemsService.getItems(res, pageIndex, pageSize)
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.delete(res, uId)
        );
    }

    async createFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.createFavourite(res, uId)
        );
    }

    async deleteFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.deleteFavourite(res, uId)
        );
    }

    async getFavourites(req: Request, res: Response, next: NextFunction) {
        const pageIndex = +req.query.pageIndex || 0;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await this.itemsService.getFavourites(res, pageIndex, pageSize)
        );
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = BuildFormGroup.createOrUpdateComment(viewModel.description);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(201).json(
            await this.itemsService.createComment(res, viewModel.itemUId, viewModel.description)
        );
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;
        const viewModel = req.body as CreateOrUpdateCommentViewModel;

        const formGroup = BuildFormGroup.createOrUpdateComment(viewModel.description);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.updateComment(res, uId, viewModel.description)
        );
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.deleteComment(res, uId)
        );
    }

    async getComments(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string;
        const pageIndex = +req.query.pageIndex || 0;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        const hasErrors = ServerValidator.addGlobalError(res, 'uId', Validators.required(uId));

        if (hasErrors) {
            throw ValidationUtil.errorResponse(res);
        }

        res.status(200).json(
            await this.itemsService.getComments(res, uId, pageIndex, pageSize)
        );
    }
}
