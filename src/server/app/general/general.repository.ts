import { Response } from 'express';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

class GeneralRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createNewsletterMember(res: Response, email: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.general.createNewsletterMember,
            {
                email
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async deleteNewsletterMember(res: Response, email: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.general.deleteNewsletterMember,
            {
                email
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async report(res: Response, userId: number | null, type: string, uId: string): Promise<boolean> {
        const result = await this.run(res, Database.queries.general.report,
            {
                userId,
                type,
                uId
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }
}

export const generalRepository = new GeneralRepository();
