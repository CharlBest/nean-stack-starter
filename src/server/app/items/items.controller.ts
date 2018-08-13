import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../shared/base-controller';
import { ItemsService } from './items.service';

export class ItemsController extends BaseController {
    private itemsService: ItemsService;

    constructor() {
        super();
        this.itemsService = new ItemsService();
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        res.status(201).json(
            await this.itemsService.create(res)
        );
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.itemsService.update(res)
        );
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.itemsService.get(res)
        );
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.itemsService.getAll(res)
        );
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(
            await this.itemsService.delete(res)
        );
    }
}
