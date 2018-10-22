import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { CommentModel } from '../../../shared/models/item/comment.model';
import { MAX_MEDIA_UPLOADS } from '../../../shared/validation/validators';
import { CommentViewModel } from '../../../shared/view-models/item/comment.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { pushNotificationBroker } from '../../communication/push-notification-broker';
import { logger } from '../../core/utils/logger';
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

        const userId = this.getUserId(res);
        const uId = nodeUUId();
        const result = await itemsRepository.create(res, userId, uId, title, description, media);

        if (!result) {
            const error = 'Error while creating item';
            logger.warn(error, [userId, uId, title, description, media]);
            throw new Error(error);
        }

        return result;
    }

    async update(res: Response, uId: string, title: string, description: string, media: Array<string>): Promise<ItemViewModel> {
        if (media && Array.isArray(media)) {
            media.slice(0, MAX_MEDIA_UPLOADS);
        }

        const userId = this.getUserId(res);
        const result = await itemsRepository.update(res, userId, uId, title, description, media);

        if (!result) {
            const error = 'Error while updating item';
            logger.warn(error, [userId, uId, title, description, media]);
            throw new Error(error);
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
        return await itemsRepository.getItems(res, this.getOptionalUserId(res), pageIndex, pageSize);
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

    async getFavourites(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        return await itemsRepository.getFavourites(res, this.getUserId(res), pageIndex, pageSize);
    }

    async createComment(res: Response, itemUId: string, description: string): Promise<CommentViewModel> {
        const userId = this.getUserId(res);
        const uId = nodeUUId();
        const result = await itemsRepository.createComment(res, userId, uId, itemUId, description);

        if (!result) {
            const error = 'Error while creating comment';
            logger.warn(error, [userId, uId, itemUId, description]);
            throw new Error(error);
        }

        // Send push notification
        pushNotificationBroker.newComment({
            commentUId: result.uId
        });

        return result;
    }

    async updateComment(res: Response, uId: string, description: string): Promise<CommentViewModel> {
        const userId = this.getUserId(res);
        const result = await itemsRepository.updateComment(res, userId, uId, description);

        if (!result) {
            const error = 'Error while updating comment';
            logger.warn(error, [userId, uId, description]);
            throw new Error(error);
        }

        return result;
    }

    async deleteComment(res: Response, uId: string): Promise<boolean> {
        return await itemsRepository.deleteComment(res, this.getUserId(res), uId);
    }

    async getComments(res: Response, uId: string, pageIndex: number, pageSize: number): Promise<CommentModel[] | null> {
        return await itemsRepository.getComments(res, this.getOptionalUserId(res), uId, pageIndex, pageSize);
    }

    async getComment(res: Response, ip: string, uId: string): Promise<CommentViewModel> {
        const result = await itemsRepository.getComment(res, this.getOptionalUserId(res), ip, uId);

        if (!result) {
            throw new Error('Error while getting comment');
        }

        return result;
    }
}

export const itemsService = new ItemsService();
