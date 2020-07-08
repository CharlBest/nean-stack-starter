import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoutes } from '@shared/routes/user.routes';
import { CompletedTutorial } from '@shared/view-models/tutorial/completed-tutorial.view-model';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { NavigationType } from '../navigation/navigation-type.enum';

@Injectable({
    providedIn: 'root'
})
export class TutorialService {

    constructor(private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private snackBar: MatSnackBar) { }

    async activateTutorial(tutorialType: TutorialType, returnUrl: string | null = '/'): Promise<void> {
        const navigateUrl = [];
        switch (tutorialType) {
            case TutorialType.NONE:
                navigateUrl.push(returnUrl);
                break;

            case TutorialType.SIGN_UP:
                navigateUrl.push('/login');
                break;

            case TutorialType.FORGOT_PASSWORD:
                navigateUrl.push('/forgot-password');
                break;

            case TutorialType.NEWSLETTER:
                navigateUrl.push('/newsletter');
                break;

            case TutorialType.FEEDBACK:
                navigateUrl.push('/feedback');
                break;

            case TutorialType.AVATAR_UPLOAD:
            case TutorialType.UPDATE_PASSWORD:
                navigateUrl.push('/profile');
                break;

            default:
                break;
        }

        await this.router.navigate(navigateUrl, {
            queryParams: { tut: tutorialType === TutorialType.NONE ? null : tutorialType },
            queryParamsHandling: 'merge'
        });

        if (tutorialType === TutorialType.NONE) {
            this.checkIfAfterTutPageHasBackNav();
        }
    }

    checkIfAfterTutPageHasBackNav(): void {
        let route = this.route;
        while (route.firstChild) {
            route = route.firstChild;
        }

        // TODO: this is not ideal. Will prevent tutorials from returning to any page with back nav which is a lot!
        if (route.snapshot.data.nav as NavigationType === NavigationType.BACK) {
            this.router.navigate(['/']);
        }
    }

    completedTutorial(viewModel: CompletedTutorial): Promise<boolean> {
        return this.http.post<boolean>(UserRoutes.completedTutorial().client(), viewModel).toPromise();
    }

    showTakeATour(): void {
        this.snackBar.open('Take the tour', 'Go', {
            duration: 4000,
        }).onAction().subscribe(() => this.activateTutorial(TutorialType.SIGN_UP));
    }
}
