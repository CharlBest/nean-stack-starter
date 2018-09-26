import { Component, OnInit } from '@angular/core';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeService } from '../../shared/services/theme.service';
import { TutorialService } from '../../shared/tutorial/tutorial.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  loggedInUserId = this.authService.getLoggedInUserId();

  constructor(public themeService: ThemeService,
    private tutorialService: TutorialService,
    private authService: AuthService) { }

  ngOnInit() {
  }

  takeTour() {
    this.tutorialService.activateTutorial(TutorialType.SignUp);
  }

  logout() {
    this.authService.removeTokenAndNavigateToLogin();
  }
}
