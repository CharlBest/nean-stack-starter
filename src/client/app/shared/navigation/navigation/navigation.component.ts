import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/map';
import { TutorialType } from '../../../shared/tutorial/tutorial-type.enum';
import { TutorialService } from '../../../shared/tutorial/tutorial.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  loggedInUserId: number = this.authService.getloggedInUserId();
  activeNavigation = Navigation.Primary;
  navigationTypes = Navigation;
  navigationBackTitle = '';
  backRouterPath: string;
  tutorialTypeEnum = TutorialType;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private titleService: Title,
    private location: Location,
    private tutorialService: TutorialService) { }

  ngOnInit() {
    this.authService.loggedInUserId$.subscribe(id => {
      this.loggedInUserId = id;
    });

    this.router.events
      .map(() => this.route)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .subscribe((event) => {
        if (event.snapshot.data) {
          const title = event.snapshot.data['title'];
          if (title !== null) {
            this.titleService.setTitle(title);
            this.navigationBackTitle = title;
          }

          const nav = event.snapshot.data['nav'] as Navigation;
          if (nav !== null) {
            this.activeNavigation = nav;
          }

          const backRouterPath = event.snapshot.data['backRouterPath'] as string;
          if (backRouterPath !== null) {
            this.backRouterPath = backRouterPath;
          } else {
            this.backRouterPath = null;
          }
        }
      });

    // if (!this.tutorial.hasDoneTutorial(TutorialArea.firstTimeUser)) {
    //   this.router.navigate(['/tutorial', TutorialArea.firstTimeUser]);
    // }
  }

  logout() {
    this.authService.removeToken();
  }

  back() {
    if (this.backRouterPath !== null && this.backRouterPath !== undefined) {
      this.router.navigate([this.backRouterPath]);
    } else {
      // TODO: check if there is a back otherwise redirect to home/discover page
      this.location.back();
    }
  }

  takeTour() {
    this.tutorialService.activateTutorial(TutorialType.ContextMenu);
  }
}

// TODO: move this to another file
export enum Navigation {
  Primary = 1,
  Back = 2
}
