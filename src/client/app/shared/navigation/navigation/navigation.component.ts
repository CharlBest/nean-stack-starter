import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TutorialType } from '../../../../../shared/view-models/tutorial/tutorial-type.enum';
import { environment } from '../../../../environments/environment';
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
  desktopTopToolbarHeight = 64;
  mobileTopToolbarHeight = 56;
  topToolbarHeightInPx: string;
  navItems: NavItem = {
    home: { paths: [{ path: '' }, { path: 'home' }, { path: 'user' }, { path: 'items' }, { path: 'item' }] },
    search: { paths: [{ path: 'search' }] },
    createItem: { paths: [{ path: 'create-item' }] },
    activity: { paths: [{ path: 'activity' }] },
    account: {
      paths: [
        { path: 'account' }, { path: 'create-user' },
        { path: 'business', exact: false }, { path: 'feedback' }, { path: 'newsletter' },
        { path: 'login' }, { path: 'forgot-password' }, { path: 'profile' },
        { path: 'payment' }, { path: 'verify' }
      ]
    }
  };

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
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.navigationService.previousUrl = event.url;
        if (this.activeNavigation === NavigationType.Primary) {
          this.hasNavigatedToPageWithPrimaryNav = true;
        }
      });

    // Navigation Start: remove expired auth token
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(event => {
        if (this.authService.hasTokenExpired()) {
          this.authService.removeToken();
        }
      });

    // Navigation End: Set title, navigation and back route
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe(event => {
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
          const backRouterPath = event.snapshot.data['backRouterPath'] || this.navigationService.backRouterPath;
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

        this.updateActiveNavItem();
      });

    this.bpService.isDesktop$.subscribe(data => {
      if (data) {
        this.topToolbarHeightInPx = `${this.desktopTopToolbarHeight}px`;
      } else {
        this.topToolbarHeightInPx = `${this.mobileTopToolbarHeight}px`;
      }
    });

    // Hide/show top toolbar
    this.showTopToolbarOnScrollUp();

    // Check if all root routes are set in nav items
    this.checkAllNavItemAssociations();
  }

  back() {
    if (this.backRouterPath) {
      this.router.navigate([this.backRouterPath]);
      this.navigationService.backRouterPath = null;
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
      if (prevScrollpos > currentScrollPos || currentScrollPos < this.desktopTopToolbarHeight ||
        this.activeNavigation === NavigationType.Back) {
        this.navbar.nativeElement.style.top = '0';
      } else {
        this.navbar.nativeElement.style.top = `-${this.topToolbarHeightInPx}`;
      }
      prevScrollpos = currentScrollPos;
    };
  }

  isAccountLinkActive() {
    if (this.router.isActive('/account', true) || this.router.isActive('/profile', true) ||
      this.router.isActive('/login', true) || this.router.isActive('/create-user', true) ||
      this.router.isActive('/forgot-password', true) || this.router.isActive('/business', false) ||
      this.router.isActive('/payment', true) || this.router.isActive('/newsletter', true) ||
      this.router.isActive('/feedback', true)) {
      if (this.bpService.isDesktop) {
        return 'mat-accent';
      } else {
        return 'mat-primary';
      }
    }
  }

  checkAllNavItemAssociations() {
    if (!environment.production) {
      const allNavItems = [].concat(...Object.keys(this.navItems).map(key => this.navItems[key].paths.map(x => x.path)));
      this.router.config.forEach(x => {
        if (!allNavItems.includes(x.path) && x.path !== '**' && x.path !== '404') {
          alert(x.path);
        }
      });
    }
  }

  updateActiveNavItem() {
    Object.keys(this.navItems).forEach(x => {
      if (this.navItems[x].paths.some(y => this.router.isActive(y.path, y.exact !== undefined ? y.exact : true))) {
        this.navItems[x].active = true;
      } else {
        this.navItems[x].active = false;
      }
    });
  }
}

interface NavItem {
  [key: string]: {
    paths: Array<{ path: string, exact?: boolean }>,
    active?: boolean
  };
}
