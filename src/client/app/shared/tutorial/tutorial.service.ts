import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReportUserViewModel } from '../../../../server/view-models/profile/report-user.view-model';
import { Observable } from 'rxjs/Observable';
import { UserRoutes } from '../../../../server/routes/user.routes';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TutorialType } from '../../../../server/view-models/tutorial/tutorial-type.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class TutorialService {
    private loggedInUserId: number = this.authService.getloggedInUserId();

    constructor(private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private http: HttpClient) {
        this.authService.loggedInUserId$.subscribe(id => {
            this.loggedInUserId = id;
        });
    }

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

        if (this.loggedInUserId) {
            // this.completedTutorial(tutorialType).subscribe();
        }

        const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams, { tut: tutorialType === TutorialType.None ? undefined : tutorialType });
        this.router.navigate(navigateUrl, { queryParams: queryParams });
    }

    public completedTutorial(tutorialType: TutorialType): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.completedTutorial.constructRootUrl()}`, { tutorialType });
    }
}
