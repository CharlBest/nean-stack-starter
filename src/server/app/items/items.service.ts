import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { CommentModel } from '../../../shared/models/item/comment.model';
import { MAX_MEDIA_UPLOADS } from '../../../shared/validation/validators';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { BaseService } from '../shared/base-service';
import { ItemsRepository } from './items.repository';

export class ItemsService extends BaseService {

    private itemsRepository: ItemsRepository;

    constructor() {
        super();
        this.itemsRepository = new ItemsRepository();
    }

    async create(res: Response, title: string, description: string, media: Array<string>): Promise<ItemViewModel> {
        if (media && Array.isArray(media)) {
            media.slice(0, MAX_MEDIA_UPLOADS);
        }
        return await this.itemsRepository.create(res, this.getUserId(res), nodeUUId(), title, description, media);
    }

    async update(res: Response, uId: string, title: string, description: string, media: Array<string>): Promise<ItemViewModel> {
        if (media && Array.isArray(media)) {
            media.slice(0, MAX_MEDIA_UPLOADS);
        }
        return await this.itemsRepository.update(res, this.getUserId(res), uId, title, description, media);
    }

    async get(res: Response, ip: string, uId: string): Promise<ItemViewModel> {
        return await this.itemsRepository.get(res, this.getUserId(res), ip, uId);
    }

    async getAll(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        return await this.itemsRepository.getAll(res, this.getUserId(res), pageIndex, pageSize);
    }

    async delete(res: Response, uId: string): Promise<boolean> {
        return await this.itemsRepository.delete(res, this.getUserId(res), uId);
    }

    async createFavourite(res: Response, uId: string): Promise<boolean> {
        return await this.itemsRepository.createFavourite(res, this.getUserId(res), uId);
    }

    async deleteFavourite(res: Response, uId: string): Promise<boolean> {
        return await this.itemsRepository.deleteFavourite(res, this.getUserId(res), uId);
    }

    async getAllFavourites(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        return await this.itemsRepository.getAllFavourites(res, this.getUserId(res), pageIndex, pageSize);
    }

    async createComment(res: Response, itemUId: string, description: string): Promise<CommentModel> {
        return await this.itemsRepository.createComment(res, this.getUserId(res), nodeUUId(), itemUId, description);
    }

    async updateComment(res: Response, uId: string, description: string): Promise<CommentModel> {
        return await this.itemsRepository.updateComment(res, this.getUserId(res), uId, description);
    }

    async deleteComment(res: Response, uId: string): Promise<boolean> {
        return await this.itemsRepository.deleteComment(res, this.getUserId(res), uId);
    }
}
