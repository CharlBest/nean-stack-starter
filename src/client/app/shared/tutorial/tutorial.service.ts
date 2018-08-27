import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../../shared/routes/user.routes';
import { CompletedTutorial } from '../../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { environment } from '../../../environments/environment';
import { NavigationType } from '../navigation/navigation/navigation-type.enum';

@Injectable({
    providedIn: 'root'
})
export class TutorialService {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient) { }

    async activateTutorial(tutorialType: TutorialType, returnUrl: string = '/') {
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
        await this.router.navigate(navigateUrl, { queryParams: queryParams });

        if (tutorialType === TutorialType.None) {
            this.checkIfAfterTutPageHasBackNav();
        }
    }

    checkIfAfterTutPageHasBackNav() {
        let route = this.route;
        while (route.firstChild) {
            route = route.firstChild;
        }

        if (route.snapshot.data['nav'] as NavigationType === NavigationType.Back) {
            this.router.navigate(['/']);
        }
    }

    public completedTutorial(viewModel: CompletedTutorial): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrlEndpoint}${UserRoutes.completedTutorial().client()}`, viewModel);
    }
}
