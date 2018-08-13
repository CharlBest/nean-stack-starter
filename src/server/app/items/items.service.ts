import { Response } from 'express';
import { BaseService } from '../shared/base-service';
import { ItemsRepository } from './items.repository';

export class ItemsService extends BaseService {

    private itemsRepository: ItemsRepository;

    constructor() {
        super();
        this.itemsRepository = new ItemsRepository();
    }

    public async create(res: Response): Promise<boolean> {
        return await this.itemsRepository.create(res, this.getUserId(res));
    }

    public async update(res: Response): Promise<boolean> {
        return await this.itemsRepository.update(res, this.getUserId(res));
    }

    public async get(res: Response): Promise<boolean> {
        return await this.itemsRepository.get(res, this.getUserId(res));
    }

    public async getAll(res: Response): Promise<boolean> {
        return await this.itemsRepository.getAll(res, this.getUserId(res));
    }

    public async delete(res: Response): Promise<boolean> {
        return await this.itemsRepository.delete(res, this.getUserId(res));
    }
}
