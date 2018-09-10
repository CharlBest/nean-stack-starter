import { NextFunction, Request, Response } from 'express';
import { BuildFormGroup, ServerValidator, Validators } from '../../../shared/validation/validators';
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

    async getAll(req: Request, res: Response, next: NextFunction) {
        const pageIndex = +req.query.pageIndex;
        const pageSize = +req.query.pageSize || this.DEFAULT_PAGE_SIZE;

        res.status(200).json(
            await this.itemsService.getAll(res, pageIndex, pageSize)
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
}
