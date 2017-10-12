import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TutorialService } from '../tutorial.service';
import { TutorialType } from '../../../../../server/view-models/tutorial/tutorial-type.enum';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { CompletedTutorial } from '../../../../../server/view-models/tutorial/completed-tutorial.view-model';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  tuts = [
    // Tutorial 1
    new Tutorial(TutorialType.ContextMenu, 'Click here for more info', TutorialType.SignUp, true),
    new Tutorial(TutorialType.SignUp, 'Sign up', TutorialType.ForgotPassword),
    new Tutorial(TutorialType.ForgotPassword, 'Forgot password feature', TutorialType.Newsletter),
    new Tutorial(TutorialType.Newsletter, 'Anonymous user newsletter signup', TutorialType.Feedback),
    new Tutorial(TutorialType.Feedback, 'Email team some feedback', TutorialType.None, undefined, true),

    // Tutorial 2
    new Tutorial(TutorialType.ProfileShare, 'Share button to share info', TutorialType.ProfileReport, true),
    new Tutorial(TutorialType.ProfileReport, 'Report button to report a user', TutorialType.DeleteUser),
    new Tutorial(TutorialType.DeleteUser, 'Delete user option', TutorialType.AvatarUpload),
    new Tutorial(TutorialType.AvatarUpload, 'Upload media (Firebase) with preloaderk', TutorialType.UpdatePassword),
    new Tutorial(TutorialType.UpdatePassword, 'Update password feature', TutorialType.None, undefined, true)
  ];

  private loggedInUserId: number = this.authService.getloggedInUserId();
  tutorialTypeEnum = TutorialType;
  tutorialInUrl: TutorialType;
  active: boolean;
  returnUrl: string = null;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private tutorialService: TutorialService) { }

  ngOnInit() {
    this.authService.loggedInUserId$.subscribe(id => {
      this.loggedInUserId = id;
    });

    this.route.queryParamMap.subscribe(params => {
      if (params.has('tut')) {
        this.tutorialInUrl = +params.get('tut');
        this.active = true;

        if (this.returnUrl === null) {
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
