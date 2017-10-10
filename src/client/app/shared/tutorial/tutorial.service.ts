import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReportUserViewModel } from '../../../../server/view-models/profile/report-user.view-model';
import { Observable } from 'rxjs/Observable';
import { UserRoutes } from '../../../../server/routes/user.routes';
import { TutorialType } from '../../../../server/view-models/tutorial/tutorial-type.enum';
import { CompletedTutorial } from '../../../../server/view-models/tutorial/completed-tutorial.view-model';

@Injectable()
export class TutorialService {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient) { }

    activateTutorial(tutorialType: TutorialType, returnUrl: string = '/') {
        const navigateUrl = [];
        switch (tutorialType) {
            case TutorialType.None:
                navigateUrl.push(returnUrl);
                break;

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

        const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams, { tut: tutorialType === TutorialType.None ? undefined : tutorialType });
        this.router.navigate(navigateUrl, { queryParams: queryParams });
    }

    public completedTutorial(viewModel: CompletedTutorial): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.completedTutorial.constructRootUrl()}`, viewModel);
    }
}
