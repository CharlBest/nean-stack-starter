import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { DEFAULT_PAGE_SIZE, ServerValidator, Validators } from '@shared/validation/validators';
import { CreateOrUpdateItemViewModel } from '@shared/view-models/item/create-or-update-item.view-model';
import { OrderFavouriteViewModel } from '@shared/view-models/item/order-favourite.view-model';
import { SearchViewModel } from '@shared/view-models/item/search.view-model';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../shared/base-controller';
import { itemsService } from './items.service';

class ItemsController extends BaseController {

    constructor() {
        super();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as CreateOrUpdateItemViewModel;

        const formGroup = FormGroupBuilder.createOrUpdateItem(viewModel.title, viewModel.description, viewModel.files, viewModel.tags);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await itemsService.create(res, viewModel.title, viewModel.description, viewModel.files, viewModel.tags)
        );
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const viewModel = req.body as CreateOrUpdateItemViewModel;

        const formGroup = FormGroupBuilder.createOrUpdateItem(viewModel.title, viewModel.description, viewModel.files, viewModel.tags);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await itemsService.update(res, uId as string, viewModel.title, viewModel.description, viewModel.files, viewModel.tags)
        );
    }

    async get(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await itemsService.get(res, req.ip, uId as string)
        );
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await itemsService.getAll(res, pageIndex, pageSize)
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await itemsService.delete(res, uId as string)
        );
    }

    async createFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await itemsService.createFavourite(res, uId as string)
        );
    }

    async deleteFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;

        const hasErrors = !!Validators.required(uId);

        if (hasErrors) {
            throw new Error(this.ERRORS.UIdRequired);
        }

        res.status(200).json(
            await itemsService.deleteFavourite(res, uId as string)
        );
    }

    async getFavourites(req: Request, res: Response, next: NextFunction) {
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await itemsService.getFavourites(res, pageIndex, pageSize)
        );
    }

    async orderFavourite(req: Request, res: Response, next: NextFunction) {
        const uId = req.params.uId as string | null;
        const viewModel = req.body as OrderFavouriteViewModel;

        const formGroup = FormGroupBuilder.orderFavourite(viewModel.newOrderVal, viewModel.originalOrderVal);
        let hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        hasErrors = hasErrors || !!Validators.required(uId);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await itemsService.orderFavourite(res, uId as string, viewModel.newOrderVal, viewModel.originalOrderVal)
        );
    }

    async search(req: Request, res: Response, next: NextFunction) {
        const pageIndex = req.query.pageIndex ? +req.query.pageIndex : null || 0;
        const pageSize = req.query.pageSize ? +req.query.pageSize : DEFAULT_PAGE_SIZE;
        const viewModel = req.body as SearchViewModel;

        const formGroup = FormGroupBuilder.search(viewModel.term);
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
