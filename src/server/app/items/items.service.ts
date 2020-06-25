import { FileModel } from '@shared/models/shared/file.model';
import { NewItemWebSocketModel } from '@shared/models/web-socket/new-item-web-socket.model';
import { WebSocketType } from '@shared/models/web-socket/web-socket.enum';
import { MAX_FILE_UPLOADS } from '@shared/validation/validators';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { webSocketServer } from '../../core/middleware/web-socket-server';
import { logger } from '../../core/utils/logger';
import { BaseService } from '../shared/base-service';
import { itemsRepository } from './items.repository';

class ItemsService extends BaseService {

    constructor() {
        super();
    }

    async create(res: Response, title: string, description: string, files: Array<FileModel>, tags: Array<string>): Promise<ItemViewModel> {
        if (files && Array.isArray(files)) {
            files = files.slice(0, MAX_FILE_UPLOADS);
            files.forEach(file => file.uId = nodeUUId());
        } else {
            files = [];
        }

        const userId = this.getUserId(res);
        const uId = nodeUUId();
        const result = await itemsRepository.create(res, userId, uId, title, description, files, tags);

        if (!result) {
            const error = 'Error while creating item';
            logger.warn(error, [userId, uId, title, description, files]);
            throw new Error(error);
        }

        // Notify everyone there is another sign up
        const model = new NewItemWebSocketModel();
        model.type = WebSocketType.NEW_ITEM;
        webSocketServer.send(model);

        return result;
    }

    async update(res: Response, uId: string, title: string, description: string, files: Array<FileModel>, tags: Array<string>)
        : Promise<ItemViewModel> {
        if (files && Array.isArray(files)) {
            files = files.slice(0, MAX_FILE_UPLOADS);
            files.forEach(file => file.uId = nodeUUId());
        } else {
            files = [];
        }

        const userId = this.getUserId(res);
        const result = await itemsRepository.update(res, userId, uId, title, description, files, tags);

        if (!result) {
            const error = 'Error while updating item';
            logger.warn(error, [userId, uId, title, description, files]);
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

    async getAll(res: Response, tags: Array<string> | null, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        return await itemsRepository.getAll(res, this.getOptionalUserId(res), tags, pageIndex, pageSize);
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

    async getFavourites(res: Response, tags: Array<string> | null, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        return await itemsRepository.getFavourites(res, this.getUserId(res), tags, pageIndex, pageSize);
    }

    async orderFavourite(res: Response, uId: string, newOrderVal: number, originalOrderVal: number): Promise<boolean> {
        return await itemsRepository.orderFavourite(res, this.getUserId(res), uId, newOrderVal, originalOrderVal);
    }

    async search(res: Response, term: string, pageIndex: number, pageSize: number): Promise<ItemViewModel[] | null> {
        return await itemsRepository.search(res, this.getOptionalUserId(res), term, pageIndex, pageSize);
    }
}

export const itemsService = new ItemsService();
