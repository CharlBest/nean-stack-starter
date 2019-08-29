import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PWAService } from '../../pwa-helper/pwa.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { NotificationService } from '../../services/notification.service';
import { WebSocketService } from '../../services/websocket.service';
import { NavigationType } from '../navigation-type.enum';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('navbar', { static: true }) navbar: ElementRef<HTMLDivElement>;

  activeNavigation?: NavigationType;
  navigationType = NavigationType;
  headerBackTitle = '';
  backRouterPath: string | null;
  hasNavigatedToPageWithPrimaryNav = false;
  readonly desktopTopToolbarHeight = 64;
  readonly mobileTopToolbarHeight = 56;
  toolbarHeight: number;
  totalToolbarHeight: number;
  navItems: NavItem = {
    home: {
      paths: [
        { path: '' }, { path: 'home' },
        { path: 'item' }, { path: 'item/comments', exact: false }, { path: 'item/edit', exact: false }, { path: 'onboarding' }
      ]
    },
    search: { paths: [{ path: 'search' }] },
    createItem: { paths: [{ path: 'item/create' }] },
    activity: { paths: [{ path: 'activity' }] },
    account: {
      paths: [
        { path: 'account' }, { path: 'sign-up' },
        { path: 'business', exact: false }, { path: 'feedback' }, { path: 'newsletter' },
        { path: 'login', exact: false }, { path: 'forgot-password' }, { path: 'profile', exact: false },
        { path: 'payment' }, { path: 'verify' }, { path: 'invite' }, { path: 'item/saved', exact: false },
        { path: 'user', exact: false }, { path: 'language' }
      ]
    }
  };

  constructor(private route: ActivatedRoute,
    public router: Router,
    private titleService: Title,
    private location: Location,
    public bpService: BreakpointService,
    public notificationService: NotificationService,
    public navigationService: NavigationService,
    public pwaService: PWAService,
    private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.initPrimaryNavWathcer();
    this.navigationEnd();
    this.configureTopToolbarOnScrollUp();
    this.checkAllNavItemAssociations();
    this.listenForNewItemsViaWebSocket();
  }


  navigationEnd() {
    // Set title, navigation and back route
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
          const title = event.snapshot.data.title || alert(`No title for path: ${event.snapshot.url}`);
          this.titleService.setTitle(title);
          this.headerBackTitle = title;

          this.activeNavigation = event.snapshot.data.nav as NavigationType;
          const backRouterPath = event.snapshot.data.backRouterPath || this.navigationService.backRouterPath;
          if (backRouterPath) {
            this.backRouterPath = backRouterPath;
          } else {
            this.backRouterPath = null;
          }

          // Reset
          this.navigationService.backRouterPath = null;

          // Reset back nav right placeholder
          // TODO: bug: wipe on page load
          if (this.navigationService.navigationPlaceholderTemplate) {
            this.navigationService.navigationPlaceholderTemplate = null;
          }
        }

        this.updateActiveNavItem();
      });
  }

  initPrimaryNavWathcer() {
    // Check if user has gone to primary nav page
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(event => {
        this.navigationService.previousUrl = (event as NavigationEnd).url;
        if (this.activeNavigation === NavigationType.PRIMARY) {
          this.hasNavigatedToPageWithPrimaryNav = true;
        }
      });
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

  configureTopToolbarOnScrollUp() {
    // Set toolbar height
    this.bpService.isDesktop$.subscribe(data => {
      if (data) {
        this.toolbarHeight = this.desktopTopToolbarHeight;
      } else {
        this.toolbarHeight = this.mobileTopToolbarHeight;
      }

      this.totalToolbarHeight = this.pwaService.canInstallAndNotInPWA ? this.toolbarHeight * 2 : this.toolbarHeight;
    });

    this.addEventListenerOnScroll();
  }

  addEventListenerOnScroll() {
    let prevScrollpos = window.pageYOffset;

    fromEvent(window, 'scroll')
      .pipe(debounceTime(40))
      .subscribe(() => {
        const currentScrollPos = window.pageYOffset;

        if (prevScrollpos > currentScrollPos || currentScrollPos < this.desktopTopToolbarHeight ||
          this.activeNavigation === NavigationType.BACK) {
          if (this.navbar.nativeElement.style.top !== '0px') {
            this.navbar.nativeElement.style.top = '0';
          }
        } else {
          if (this.navbar.nativeElement.style.top !== `-${this.totalToolbarHeight}px`) {
            this.navbar.nativeElement.style.top = `-${this.totalToolbarHeight}px`;
          }
        }
        prevScrollpos = currentScrollPos;
      });
  }

  checkAllNavItemAssociations() {
    if (!environment.production) {
      const allNavItems = ([] as Array<string>)
        .concat(...Object.keys(this.navItems).map(key => this.navItems[key].paths.map(path => path.path)));

      this.router.config.forEach(route => {
        if (route.path && !allNavItems.includes(route.path) && route.path !== '**' && route.path !== '404') {
          alert(route.path);
        }
      });
    }
  }

  updateActiveNavItem() {
    for (const key in this.navItems) {
      if (this.navItems.hasOwnProperty(key)) {
        if (this.navItems[key].paths.some(path => this.router.isActive(path.path, path.exact !== undefined ? path.exact : true))) {
          this.navItems[key].active = true;
        } else {
          this.navItems[key].active = false;
        }
      }
    }
  }

  showInstallBanner(showInstallBanner: boolean) {
    if (showInstallBanner) {
      this.totalToolbarHeight = this.toolbarHeight * 2;
    } else {
      this.totalToolbarHeight = this.toolbarHeight;
    }
  }

  listenForNewItemsViaWebSocket() {
    this.webSocketService.newItem$
      .subscribe(() => {
        this.navigationService.showHomeNavigationBadge = true;
      });
  }
}

interface NavItem {
  [key: string]: {
    paths: Array<{ path: string, exact?: boolean }>,
    active?: boolean
  };
}
