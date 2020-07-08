import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompletedTutorial } from '@shared/view-models/tutorial/completed-tutorial.view-model';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { AuthService } from '../../services/auth.service';
import { Tutorial } from '../tutorial.model';
import { TutorialService } from '../tutorial.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  tuts = [
    // Tutorial 1
    new Tutorial(TutorialType.SIGN_UP, 'Sign up here!', TutorialType.FORGOT_PASSWORD, true),
    new Tutorial(TutorialType.FORGOT_PASSWORD, 'Forgot your password?', TutorialType.NEWSLETTER),
    new Tutorial(TutorialType.NEWSLETTER, 'Newsletter sign up to stay up to date', TutorialType.FEEDBACK),
    new Tutorial(TutorialType.FEEDBACK, 'Email the team some feedback', TutorialType.NONE, undefined, true),

    // Tutorial 2
    new Tutorial(TutorialType.AVATAR_UPLOAD, 'Upload your avatar', TutorialType.UPDATE_PASSWORD, true),
    new Tutorial(TutorialType.UPDATE_PASSWORD, 'Update your password', TutorialType.NONE, undefined, true)
  ];
  tutorialInUrl: TutorialType | null;
  active: boolean;
  returnUrl: string | null;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private tutorialService: TutorialService) { }

  ngOnInit(): void {
    this.getParams();
  }

  getParams(): void {
    this.route.queryParamMap
      .subscribe(params => {
        if (params.has('tut')) {
          const tut = params.get('tut');
          if (tut) {
            this.tutorialInUrl = +tut;
          }
          this.active = true;

          if (!this.returnUrl) {
            this.returnUrl = location.pathname || '/';
          }
        } else {
          this.tutorialInUrl = null;
          this.active = false;
          this.returnUrl = null;
        }
      });
  }

  goToTutorial(tutorial: Tutorial): void {
    this.tutorialService.activateTutorial(tutorial.nextTutorial, this.returnUrl);

    this.logTutorial(tutorial);
  }

  skip(tutorial: Tutorial): void {
    this.tutorialService.activateTutorial(TutorialType.NONE, this.returnUrl);

    this.logTutorial(tutorial, true);
  }

  async logTutorial(tutorial: Tutorial, didSkip: boolean = false): Promise<void> {
    if (this.authService.loggedInUserId) {
      const viewModel = new CompletedTutorial();
      viewModel.tutorialType = tutorial.tutorialType;
      viewModel.didSkip = didSkip;

      this.tutorialService.completedTutorial(viewModel)
        .catch(error => {
          // TODO: error handling
        });
    }
  }

  back(): void {
    this.location.back();
  }

  preventClick(event: Event): boolean {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  trackByFn(index: number, item: Tutorial): number {
    return index;
  }
}
