import { Response } from 'express';
import { Emailer } from '../../email/emailer';
import { BaseService } from '../shared/base-service';
import { GeneralRepository } from './general.repository';

export class GeneralService extends BaseService {

    private generalRepository: GeneralRepository;

    constructor() {
        super();
        this.generalRepository = new GeneralRepository();
    }

    public async createNewsletterMember(res: Response, email: string): Promise<boolean> {
        email = email.toLowerCase();
        return await this.generalRepository.createNewsletterMember(res, email);
    }

    public async deleteNewsletterMember(res: Response, email: string): Promise<boolean> {
        email = email.toLowerCase();
        return await this.generalRepository.deleteNewsletterMember(res, email);
    }

    public async sendFeedback(res: Response, content: string): Promise<void> {
        Emailer.feedbackEmail(content);
    }
}
