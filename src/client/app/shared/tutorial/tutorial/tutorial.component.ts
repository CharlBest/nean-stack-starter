import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompletedTutorial } from '../../../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { TutorialType } from '../../../../../shared/view-models/tutorial/tutorial-type.enum';
import { AuthService } from '../../services/auth.service';
import { TutorialService } from '../tutorial.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  private loggedInUserId = this.authService.getLoggedInUserId();
  tuts = [
    // Tutorial 1
    new Tutorial(TutorialType.SignUp, 'Sign up here!', TutorialType.ForgotPassword, true),
    new Tutorial(TutorialType.ForgotPassword, 'Forgot your password?', TutorialType.Newsletter),
    new Tutorial(TutorialType.Newsletter, 'Newsletter sign up to stay up to date', TutorialType.Feedback),
    new Tutorial(TutorialType.Feedback, 'Email the team some feedback', TutorialType.None, undefined, true),

    // Tutorial 2
    new Tutorial(TutorialType.ProfileShare, 'Share your profile', TutorialType.ProfileReport, true),
    new Tutorial(TutorialType.ProfileReport, 'Report the user', TutorialType.DeleteUser),
    new Tutorial(TutorialType.DeleteUser, 'Delete your account', TutorialType.AvatarUpload),
    new Tutorial(TutorialType.AvatarUpload, 'Upload your avatar', TutorialType.UpdatePassword),
    new Tutorial(TutorialType.UpdatePassword, 'Update your password', TutorialType.None, undefined, true)
  ];
  tutorialTypeEnum = TutorialType;
  tutorialInUrl: TutorialType | null;
  active: boolean;
  returnUrl: string | null;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private tutorialService: TutorialService) { }

  ngOnInit() {
    this.authService.loggedInUserId$
      .subscribe(id => {
        this.loggedInUserId = id;
      });

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

  goToTutorial(tutorial: Tutorial) {
    this.tutorialService.activateTutorial(tutorial.nextTutorial, this.returnUrl);

    this.logTutorial(tutorial);
  }

  skip(tutorial: Tutorial) {
    this.tutorialService.activateTutorial(TutorialType.None, this.returnUrl);

    this.logTutorial(tutorial, true);
  }

  logTutorial(tutorial: Tutorial, didSkip: boolean = false) {
    if (this.loggedInUserId) {
      const viewModel = new CompletedTutorial();
      viewModel.tutorialType = tutorial.tutorialType;
      viewModel.didSkip = didSkip;

      this.tutorialService.completedTutorial(viewModel).subscribe();
    }
  }

  back() {
    this.location.back();
  }

  preventClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}

class Tutorial {
  constructor(public tutorialType: TutorialType,
    public text: string,
    public nextTutorial: TutorialType,
    public isFirst: boolean = false,
    public isLast: boolean = false) {
    this.tutorialType = tutorialType;
    this.text = text;
    this.nextTutorial = nextTutorial;
    this.isFirst = isFirst;
    this.isLast = isLast;
  }
}
