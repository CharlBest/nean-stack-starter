import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { BaseService } from '../shared/base-service';
import { ItemsRepository } from './items.repository';

export class ItemsService extends BaseService {

    private itemsRepository: ItemsRepository;

    constructor() {
        super();
        this.itemsRepository = new ItemsRepository();
    }

    public async create(res: Response, title: string, description: string): Promise<ItemViewModel> {
        return await this.itemsRepository.create(res, this.getUserId(res), nodeUUId(), title, description);
    }

    public async update(res: Response): Promise<ItemViewModel> {
        return await this.itemsRepository.update(res, this.getUserId(res));
    }

    public async get(res: Response, uId: string): Promise<ItemViewModel> {
        return await this.itemsRepository.get(res, this.getUserId(res), uId);
    }

    public async getAll(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        return await this.itemsRepository.getAll(res, this.getUserId(res), pageIndex, pageSize);
    }

    public async delete(res: Response, uId: string): Promise<boolean> {
        return await this.itemsRepository.delete(res, this.getUserId(res), uId);
    }
}
