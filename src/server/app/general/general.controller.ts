import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ServerValidator, Validators } from '@shared/validation/validators';
import { FeedbackViewModel } from '@shared/view-models/feedback/feedback.view-model';
import { InviteViewModel } from '@shared/view-models/invite/invite.view-model';
import { NewsletterMemberViewModel } from '@shared/view-models/newsletter/newsletter-member.view-model';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../shared/base-controller';
import { generalService } from './general.service';

class GeneralController extends BaseController {

    constructor() {
        super();
    }

    async createNewsletterMember(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as NewsletterMemberViewModel;

        if (viewModel.email) {
            viewModel.email = viewModel.email.trim();
        }

        const formGroup = FormGroupBuilder.newsletter(viewModel.email);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(201).json(
            await generalService.createNewsletterMember(res, viewModel.email)
        );
    }

    async deleteNewsletterMember(req: Request, res: Response, next: NextFunction) {
        let email = req.params.email as string | null;

        if (email) {
            email = email.trim();
        }

        const formGroup = FormGroupBuilder.newsletter(email);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        res.status(200).json(
            await generalService.deleteNewsletterMember(res, email as string)
        );
    }

    async sendFeedback(req: Request, res: Response, next: NextFunction) {
        const viewModel = req.body as FeedbackViewModel;

        const formGroup = FormGroupBuilder.feedback(viewModel.content);
        const hasErrors = ServerValidator.setErrorsAndSave(res, formGroup);

        if (hasErrors) {
            throw new Error();
        }

        generalService.sendFeedback(res, viewModel.content);

        res.status(200).json();
    }

    async invite(req: Request, res: Response, next: NextFunction) {
        // TODO: this endpoint can be overloaded with to many emails or requests
        const viewModel = req.body as InviteViewModel;

        // Remove duplicates
        // viewModel.emails = [...new Set(viewModel.emails)];

        let hasErrors = false;
        if (viewModel.emails && viewModel.emails.length > 0) {
            for (const email of viewModel.emails) {
                hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'inviteEmails', Validators.required(email));
                hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'inviteEmails', Validators.email(email));
            }
        } else {
            hasErrors = hasErrors || ServerValidator.addGlobalError(res, 'inviteEmails', Validators.required(null));
        }

        if (hasErrors) {
            throw new Error();
        }

        generalService.invite(res, viewModel.emails);

        res.status(200).json();
    }
}

export const generalController = new GeneralController();
