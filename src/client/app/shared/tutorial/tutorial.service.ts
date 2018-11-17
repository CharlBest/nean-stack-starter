import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../../shared/routes/user.routes';
import { CompletedTutorial } from '../../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { environment } from '../../../environments/environment';
import { NavigationType } from '../navigation/navigation-type.enum';

@Injectable({
    providedIn: 'root'
})
export class TutorialService {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private snackBar: MatSnackBar) { }

    async activateTutorial(tutorialType: TutorialType, returnUrl: string | null = '/') {
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

            case TutorialType.AvatarUpload:
            case TutorialType.UpdatePassword:
                navigateUrl.push('/profile');
                break;

            default:
                break;
        }

        await this.router.navigate(navigateUrl, {
            queryParams: { tut: tutorialType === TutorialType.None ? null : tutorialType },
            queryParamsHandling: 'merge'
        });

        if (tutorialType === TutorialType.None) {
            this.checkIfAfterTutPageHasBackNav();
        }
    }

    checkIfAfterTutPageHasBackNav() {
        let route = this.route;
        while (route.firstChild) {
            route = route.firstChild;
        }

        // TODO: this is not ideal. Will prevent tutorials from returning to any page with back nav which is a lot!
        if (route.snapshot.data['nav'] as NavigationType === NavigationType.Back) {
            this.router.navigate(['/']);
        }
    }

    completedTutorial(viewModel: CompletedTutorial): Observable<boolean> {
        return this.http.post<boolean>(`${environment.httpDomain}${UserRoutes.completedTutorial().client()}`, viewModel);
    }

    checkHasVisited() {
        const hasVisitedStorageKey = 'has_user_visited';
        const hasUserVisited = localStorage.getItem(hasVisitedStorageKey) === 'true';

        if (!hasUserVisited) {
            localStorage.setItem(hasVisitedStorageKey, 'true');

            this.snackBar.open('Take the tour', 'Go', {
                duration: 20000,
            }).onAction()
                .subscribe(() => {
                    this.activateTutorial(TutorialType.SignUp);
                });
        }
    }
}
