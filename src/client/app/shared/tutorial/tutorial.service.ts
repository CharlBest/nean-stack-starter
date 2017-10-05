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
            case TutorialType.ForgotPassword:
                navigateUrl.push('/login');
                break;

            case TutorialType.SignUp:
                navigateUrl.push('/login');
                break;

            default:
                break;
        }

        const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams, { tut: tutorialType });
        this.router.navigate(navigateUrl, { queryParams: queryParams });
    }

    deactivateTutorial() {
        const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams, { tut: undefined });
        this.router.navigate([], { queryParams: queryParams });
    }
}
