import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TutorialService } from '../tutorial.service';
import { TutorialType } from '../../../../../server/view-models/tutorial/tutorial-type.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  tuts = [
    // Tutorial 1
    new Tutorial(TutorialType.ContextMenu, 'Click here for more info', TutorialType.SignUp),
    new Tutorial(TutorialType.SignUp, 'Sign up', TutorialType.ForgotPassword),
    new Tutorial(TutorialType.ForgotPassword, 'Forgot password feature', TutorialType.Newsletter),
    new Tutorial(TutorialType.Newsletter, 'Anonymous user newsletter signup', TutorialType.Feedback),
    new Tutorial(TutorialType.Feedback, 'Email team some feedback', TutorialType.None),

    // Tutorial 2
    new Tutorial(TutorialType.ProfileShare, 'Share button to share info', TutorialType.ProfileReport),
    new Tutorial(TutorialType.ProfileReport, 'Report button to report a user', TutorialType.DeleteUser),
    new Tutorial(TutorialType.DeleteUser, 'Delete user option', TutorialType.AvatarUpload),
    new Tutorial(TutorialType.AvatarUpload, 'Upload media (Firebase) with preloaderk', TutorialType.UpdatePassword),
    new Tutorial(TutorialType.UpdatePassword, 'Update password feature', TutorialType.None)
  ];

  tutorialTypeEnum = TutorialType;
  tutorialInUrl: TutorialType;
  active: boolean;
  returnUrl: string = null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private tutorialService: TutorialService) { }

  ngOnInit() {
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

  goToTutorial(tutorialType: TutorialType) {
    this.tutorialService.activateTutorial(tutorialType, this.returnUrl);
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
  constructor(public tutorialType: TutorialType, public text: string, public nextTutorial: TutorialType) {
    this.tutorialType = tutorialType;
    this.text = text;
    this.nextTutorial = nextTutorial;
  }
}
