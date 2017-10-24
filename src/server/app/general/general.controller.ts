import { NextFunction, Request, Response, Router } from 'express';
import { v4 as nodeUUId } from 'node-uuid';
import { GeneralService } from './general.service';
import { Database } from '../../core/database';
import { BaseController } from '../shared/base-controller';
import { ValidationUtil } from '../../core/utils/validation-util';
import { Emailer } from '../../email/emailer';
import { Validators } from '../../validation/validators';
import { LoginViewModel } from '../../view-models/create-user/login.view-model';
import { CreateUserViewModel } from '../../view-models/create-user/create-user.view-model';
import { NewsletterMemberViewModel } from '../../view-models/newsletter/newsletter-member.view-model';
import { ForgotPasswordViewModel } from '../../view-models/forgot-password/forgot-password.view-model';
import { ChangeForgottenPasswordViewModel } from '../../view-models/forgot-password/change-forgotten-password.view-model';
import { UpdateAvatarViewModel } from '../../view-models/profile/update-avatar.view-model';
import { UpdateBioViewModel } from '../../view-models/profile/update-bio.view-model';
import { UpdatePasswordViewModel } from '../../view-models/profile/update-password.view-model';
import { FeedbackViewModel } from '../../view-models/feedback/feedback.view-model';
import { TutorialType } from '../../view-models/tutorial/tutorial-type.enum';
import { CompletedTutorial } from '../../view-models/tutorial/completed-tutorial.view-model';
import { PaymentRequestViewModel } from '../../view-models/payment/payment-request.view-model';
import { WebSocketServer } from '../../core/middleware/web-socket-server';
import * as webSocket from 'ws';

export class GeneralController extends BaseController {
    private generalService: GeneralService;

    constructor() {
        super();
        this.generalService = new GeneralService();
    }

    public async createNewsletterMember(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as NewsletterMemberViewModel;

            const valid = Validators.required({ value: viewModel.email }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            const response = await this.generalService.createNewsletterMember(Database.getSession(req), req.body);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async deleteNewsletterMember(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as NewsletterMemberViewModel;

            const valid = Validators.required({ value: viewModel.email }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            const response = await this.generalService.deleteNewsletterMember(Database.getSession(req), req.body);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async sendFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as FeedbackViewModel;

            const valid = Validators.required({ value: viewModel.content }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            // TODO: sending emails should happen is the service layer
            Emailer.feedbackEmail(viewModel.content);
            res.status(200).json();
        } catch (error) {
            this.returnError(res, error);
        }
    }

    public async paymentRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const viewModel = req.body as PaymentRequestViewModel;

            const valid = Validators.required({ value: viewModel.token }) ||
                Validators.required({ value: viewModel.amount }) ||
                null;

            if (valid !== null) {
                throw ValidationUtil.createValidationErrors(valid);
            }

            const response = await this.generalService.paymentRequest(Database.getSession(req), this.getUserId(req), viewModel);
            res.status(200).json(response);
        } catch (error) {
            this.returnError(res, error);
        }
    }
}
