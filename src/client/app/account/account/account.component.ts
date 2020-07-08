import { Component } from '@angular/core';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeService } from '../../shared/services/theme.service';
import { TutorialService } from '../../shared/tutorial/tutorial.service';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  constructor(public themeService: ThemeService,
    private tutorialService: TutorialService,
    public authService: AuthService) { }

  takeTour(): void {
    this.tutorialService.activateTutorial(TutorialType.SIGN_UP);
  }

  logout(): void {
    this.authService.removeTokenAndNavigateToLogin();
  }
}
