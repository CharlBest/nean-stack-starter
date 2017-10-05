import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReportUserViewModel } from '../../../../server/view-models/profile/report-user.view-model';
import { Observable } from 'rxjs/Observable';
import { UserRoutes } from '../../../../server/routes/user.routes';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TutorialType } from './tutorial-type.enum';

@Injectable()
export class TutorialService {
    constructor(private route: ActivatedRoute,
        private router: Router) { }

    activateTutorial(tutorialType: TutorialType) {
        const navigateUrl = [];
        switch (tutorialType) {
            case TutorialType.SignUp:
                navigateUrl.push('/login');
                break;

            case TutorialType.ForgotPassword:
                navigateUrl.push('/forgot-password');
                break;

            case TutorialType.Newsletter:
                navigateUrl.push('/newsletter');
                break;

            case TutorialType.Feedback:
                navigateUrl.push('/feedback');
                break;

            case TutorialType.ProfileShare:
            case TutorialType.ProfileReport:
            case TutorialType.DeleteUser:
            case TutorialType.AvatarUpload:
            case TutorialType.UpdatePassword:
                navigateUrl.push('/profile');
                break;

            default:
                break;
        }

        const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams, { tut: tutorialType });
        this.router.navigate(navigateUrl, { queryParams: queryParams });
    }

    deactivateTutorial(url: string) {
        const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams, { tut: undefined });
        this.router.navigate([url], { queryParams: queryParams });
    }
}
