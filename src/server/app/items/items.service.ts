import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { CommentModel } from '../../../shared/models/item/comment.model';
import { MAX_MEDIA_UPLOADS } from '../../../shared/validation/validators';
import { CommentViewModel } from '../../../shared/view-models/item/comment.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { BaseService } from '../shared/base-service';
import { itemsRepository } from './items.repository';

class ItemsService extends BaseService {

    constructor() {
        super();
    }

    async create(res: Response, title: string, description: string, media: Array<string>): Promise<ItemViewModel> {
        if (media && Array.isArray(media)) {
            media.slice(0, MAX_MEDIA_UPLOADS);
        }

        const result = await itemsRepository.create(res, this.getUserId(res), nodeUUId(), title, description, media);

        if (!result) {
            throw new Error('Error while creating item');
        }

        return result;
    }

    async update(res: Response, uId: string, title: string, description: string, media: Array<string>): Promise<ItemViewModel> {
        if (media && Array.isArray(media)) {
            media.slice(0, MAX_MEDIA_UPLOADS);
        }

        const result = await itemsRepository.update(res, this.getUserId(res), uId, title, description, media);

        if (!result) {
            throw new Error('Error while updating item');
        }

        return result;
    }

    async get(res: Response, ip: string, uId: string): Promise<ItemViewModel> {
        const result = await itemsRepository.get(res, this.getOptionalUserId(res), ip, uId);

        if (!result) {
            throw new Error('Error while getting item');
        }

        return result;
    }

    async getItems(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await itemsRepository.getItems(res, this.getOptionalUserId(res), pageIndex, pageSize);

        if (!result) {
            throw new Error('Error while getting items');
        }

        return result;
    }

    async delete(res: Response, uId: string): Promise<boolean> {
        return await itemsRepository.delete(res, this.getUserId(res), uId);
    }

    async createFavourite(res: Response, uId: string): Promise<boolean> {
        return await itemsRepository.createFavourite(res, this.getUserId(res), uId);
    }

    async deleteFavourite(res: Response, uId: string): Promise<boolean> {
        return await itemsRepository.deleteFavourite(res, this.getUserId(res), uId);
    }

    async getFavourites(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        const result = await itemsRepository.getFavourites(res, this.getUserId(res), pageIndex, pageSize);

        if (!result) {
            throw new Error('Error while getting favourites');
        }

        return result;
    }

    async createComment(res: Response, itemUId: string, description: string): Promise<CommentModel> {
        const result = await itemsRepository.createComment(res, this.getUserId(res), nodeUUId(), itemUId, description);

        if (!result) {
            throw new Error('Error while creating comment');
        }

        return result;
    }

    async updateComment(res: Response, uId: string, description: string): Promise<CommentModel> {
        const result = await itemsRepository.updateComment(res, this.getUserId(res), uId, description);

        if (!result) {
            throw new Error('Error while updating comment');
        }

        return result;
    }

    async deleteComment(res: Response, uId: string): Promise<boolean> {
        return await itemsRepository.deleteComment(res, this.getUserId(res), uId);
    }

    async getComments(res: Response, uId: string, pageIndex: number, pageSize: number): Promise<CommentModel[]> {
        const result = await itemsRepository.getComments(res, this.getUserId(res), uId, pageIndex, pageSize);

        if (!result) {
            throw new Error('Error while getting comments');
        }

        return result;
    }

    async getComment(res: Response, ip: string, uId: string): Promise<CommentViewModel> {
        const result = await itemsRepository.getComment(res, this.getUserId(res), ip, uId);

        if (!result) {
            throw new Error('Error while getting comment');
        }

        return result;
    }
}

export const itemsService = new ItemsService();
