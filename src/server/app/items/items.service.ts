import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { ItemModel } from '../../../shared/models/item/item.model';
import { BaseService } from '../shared/base-service';
import { ItemsRepository } from './items.repository';

export class ItemsService extends BaseService {

    private itemsRepository: ItemsRepository;

    constructor() {
        super();
        this.itemsRepository = new ItemsRepository();
    }

    public async create(res: Response, title: string, description: string): Promise<ItemModel> {
        return await this.itemsRepository.create(res, this.getUserId(res), nodeUUId(), title, description);
    }

    public async update(res: Response): Promise<boolean> {
        return await this.itemsRepository.update(res, this.getUserId(res));
    }

    public async get(res: Response): Promise<boolean> {
        return await this.itemsRepository.get(res, this.getUserId(res));
    }

    public async getAll(res: Response, pageIndex: number, pageSize: number): Promise<ItemModel[]> {
        return await this.itemsRepository.getAll(res, pageIndex, pageSize);
    }

    public async delete(res: Response): Promise<boolean> {
        return await this.itemsRepository.delete(res, this.getUserId(res));
    }
}
