import { CommentModel } from '@shared/models/item/comment.model';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { Response } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { pushNotificationBroker } from '../../communication/push-notification-broker';
import { logger } from '../../core/utils/logger';
import { BaseService } from '../shared/base-service';
import { repliesRepository } from './replies.repository';

class RepliesService extends BaseService {

    constructor() {
        super();
    }

    async create(res: Response, itemUId: string, description: string): Promise<CommentViewModel> {
        const userId = this.getUserId(res);
        const uId = nodeUUId();
        const result = await repliesRepository.create(res, userId, uId, itemUId, description);

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

    async update(res: Response, uId: string, description: string): Promise<CommentViewModel> {
        const userId = this.getUserId(res);
        const result = await repliesRepository.update(res, userId, uId, description);

        if (!result) {
            const error = 'Error while updating comment';
            logger.warn(error, [userId, uId, description]);
            throw new Error(error);
        }

        return result;
    }

    async delete(res: Response, uId: string): Promise<boolean> {
        return await repliesRepository.delete(res, this.getUserId(res), uId);
    }

    async get(res: Response, ip: string, uId: string): Promise<CommentViewModel> {
        const result = await repliesRepository.get(res, this.getOptionalUserId(res), ip, uId);

        if (!result) {
            throw new Error('Error while getting comment');
        }

        return result;
    }

    async getAll(res: Response, uId: string, pageIndex: number, pageSize: number): Promise<CommentModel[] | null> {
        return await repliesRepository.getAll(res, this.getOptionalUserId(res), uId, pageIndex, pageSize);
    }
}

export const repliesService = new RepliesService();
