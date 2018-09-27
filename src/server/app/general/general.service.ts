import { Response } from 'express';
import { Emailer } from '../../email/emailer';
import { BaseService } from '../shared/base-service';
import { generalRepository } from './general.repository';

class GeneralService extends BaseService {

    constructor() {
        super();
    }

    async createNewsletterMember(res: Response, email: string): Promise<boolean> {
        email = email.toLowerCase();
        return await generalRepository.createNewsletterMember(res, email);
    }

    async deleteNewsletterMember(res: Response, email: string): Promise<boolean> {
        email = email.toLowerCase();
        return await generalRepository.deleteNewsletterMember(res, email);
    }

    async sendFeedback(res: Response, content: string): Promise<void> {
        Emailer.feedbackEmail(content);
    }

    async invite(res: Response, emails: Array<string>): Promise<void> {
        Emailer.invite(emails);
    }
}

export const generalService = new GeneralService();
