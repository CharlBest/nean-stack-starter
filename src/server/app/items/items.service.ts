import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { CommentModel } from '../../../shared/models/item/comment.model';
import { MAX_MEDIA_UPLOADS, ServerValidator } from '../../../shared/validation/validators';
import { CommentViewModel } from '../../../shared/view-models/item/comment.view-model';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { ValidationUtil } from '../../core/utils/validation-util';
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

        const result = await this.itemsRepository.create(res, this.getUserId(res), nodeUUId(), title, description, media);

        if (!result) {
            ServerValidator.addGlobalError(res, 'item', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }

    async update(res: Response, uId: string, title: string, description: string, media: Array<string>): Promise<ItemViewModel> {
        if (media && Array.isArray(media)) {
            media.slice(0, MAX_MEDIA_UPLOADS);
        }

        const result = await this.itemsRepository.update(res, this.getUserId(res), uId, title, description, media);

        if (!result) {
            ServerValidator.addGlobalError(res, 'item', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }

    async get(res: Response, ip: string, uId: string): Promise<ItemViewModel> {
        const result = await this.itemsRepository.get(res, this.getOptionalUserId(res), ip, uId);

        if (!result) {
            ServerValidator.addGlobalError(res, 'item', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }

    async getItems(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        const result = await this.itemsRepository.getItems(res, this.getOptionalUserId(res), pageIndex, pageSize);

        if (!result) {
            ServerValidator.addGlobalError(res, 'item', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
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

    async getFavourites(res: Response, pageIndex: number, pageSize: number): Promise<ItemViewModel[]> {
        const result = await this.itemsRepository.getFavourites(res, this.getUserId(res), pageIndex, pageSize);

        if (!result) {
            ServerValidator.addGlobalError(res, 'favourite', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }

    async createComment(res: Response, itemUId: string, description: string): Promise<CommentModel> {
        const result = await this.itemsRepository.createComment(res, this.getUserId(res), nodeUUId(), itemUId, description);

        if (!result) {
            ServerValidator.addGlobalError(res, 'comment', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }

    async updateComment(res: Response, uId: string, description: string): Promise<CommentModel> {
        const result = await this.itemsRepository.updateComment(res, this.getUserId(res), uId, description);

        if (!result) {
            ServerValidator.addGlobalError(res, 'comment', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }

    async deleteComment(res: Response, uId: string): Promise<boolean> {
        return await this.itemsRepository.deleteComment(res, this.getUserId(res), uId);
    }

    async getComments(res: Response, uId: string, pageIndex: number, pageSize: number): Promise<CommentModel[]> {
        const result = await this.itemsRepository.getComments(res, this.getUserId(res), uId, pageIndex, pageSize);

        if (!result) {
            ServerValidator.addGlobalError(res, 'comment', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }

    async getComment(res: Response, ip: string, uId: string): Promise<CommentViewModel> {
        const result = await this.itemsRepository.getComment(res, this.getUserId(res), ip, uId);

        if (!result) {
            ServerValidator.addGlobalError(res, 'comment', { required: true });
            throw ValidationUtil.errorResponse(res);
        }

        return result;
    }
}
