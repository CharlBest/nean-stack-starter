import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TutorialType } from '../../../../../shared/view-models/tutorial/tutorial-type.enum';
import { AuthService } from '../../services/auth.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { NotificationService } from '../../services/notification.service';
import { NavigationType } from '../navigation-type.enum';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('navbar') navbar: ElementRef<HTMLDivElement>;

  loggedInUserId: number = this.authService.getLoggedInUserId();
  activeNavigation;
  navigationType = NavigationType;
  headerBackTitle = '';
  backRouterPath: string;
  tutorialTypeEnum = TutorialType;
  hasNavigatedToPageWithPrimaryNav = false;
  topToolbarHeight = 64;
  topToolbarHeightInPx = `${this.topToolbarHeight}px`;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    private titleService: Title,
    private location: Location,
    private snackBar: MatSnackBar,
    public bpService: BreakpointService,
    public notificationService: NotificationService,
    public navigationService: NavigationService) {
    this.checkHasVisited();
  }

  ngOnInit() {
    this.authService.loggedInUserId$
      .subscribe(id => {
        this.loggedInUserId = id;
      });

    // Check if user has gone to primary nav page
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd && this.activeNavigation === NavigationType.Primary) {
          this.hasNavigatedToPageWithPrimaryNav = true;
        }
      });

    // Set title, navigation and back route
    this.router.events
      .pipe(
        map(() => this.route),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe((event) => {
        if (event.snapshot.data) {
          const title = event.snapshot.data['title'];
          if (title) {
            this.titleService.setTitle(title);
            this.headerBackTitle = title;
          }

          const nav = event.snapshot.data['nav'] as NavigationType;
          if (nav) {
            this.activeNavigation = nav;
          }

          const backRouterPath = event.snapshot.data['backRouterPath'] as string;
          if (backRouterPath) {
            this.backRouterPath = backRouterPath;
          } else {
            this.backRouterPath = null;
          }

          // Reset back nav right placeholder
          // TODO: bug: wipe on page load
          if (this.navigationService.navigationPlaceholderTemplate) {
            this.navigationService.navigationPlaceholderTemplate = null;
          }
        }
      });

    // Hide/show top toolbar
    this.showTopToolbarOnScrollUp();
  }

  back() {
    if (this.backRouterPath) {
      this.router.navigate([this.backRouterPath]);
    } else {
      if (document.referrer === '' && !this.hasNavigatedToPageWithPrimaryNav) {
        this.router.navigate(['/']);
      } else {
        this.location.back();
      }
    }
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
          this.router.navigate([], { queryParams: { tut: TutorialType.SignUp }, queryParamsHandling: 'merge' });
        });
    }
  }

  showTopToolbarOnScrollUp() {
    let prevScrollpos = window.pageYOffset;
    // TODO: this could be a performance bottleneck (Add debounce)
    window.onscroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos || currentScrollPos < this.topToolbarHeight || this.activeNavigation === NavigationType.Back) {
        this.navbar.nativeElement.style.top = '0';
      } else {
        this.navbar.nativeElement.style.top = `-${this.topToolbarHeightInPx}`;
      }
      prevScrollpos = currentScrollPos;
    };
  }

  goToHome() {
    if (this.router.isActive('/', true)) {
      // TODO: not the greatest experience
      location.reload();
    } else {
      this.router.navigate(['/']);
    }
  }

  isAccountLinkActive() {
    if (this.router.isActive('/account', true) || this.router.isActive('/profile', true) ||
      this.router.isActive('/login', true) || this.router.isActive('/create-user', true) ||
      this.router.isActive('/forgot-password', true) || this.router.isActive('/business', false) ||
      this.router.isActive('/payment', true) || this.router.isActive('/newsletter', true) ||
      this.router.isActive('/feedback', true)) {
      if (this.bpService.isWeb) {
        return 'mat-accent';
      } else {
        return 'mat-primary';
      }
    }
  }
}
