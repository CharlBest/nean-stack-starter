import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TutorialType } from '../../../../../shared/view-models/tutorial/tutorial-type.enum';
import { TutorialService } from '../../../shared/tutorial/tutorial.service';
import { PaymentDialogService } from '../../payment-dialog/payment-dialog.service';
import { AuthService } from '../../services/auth.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { PreventBackNavigationService } from '../../services/prevent-back-navigation.service';
import { ThemeService } from '../../services/theme.service';
import { HeaderType } from "./header-type.enum";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('bottomSheetContextMenu') bottomSheetContextMenu: TemplateRef<any>;
  @ViewChild('contextMenuTrigger') contextMenuTrigger: MatMenuTrigger;

  loggedInUserId: number = this.authService.getLoggedInUserId();
  activeHeader = HeaderType.Primary;
  headerTypes = HeaderType;
  headerBackTitle = '';
  backRouterPath: string;
  tutorialTypeEnum = TutorialType;
  hasNavigatedToPageWithPrimaryNav = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private titleService: Title,
    private location: Location,
    private tutorialService: TutorialService,
    public snackBar: MatSnackBar,
    private paymentDialogService: PaymentDialogService,
    public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService,
    public themeService: ThemeService,
    private preventBackNavigationService: PreventBackNavigationService) {
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
        if (event instanceof NavigationEnd && this.activeHeader === HeaderType.Primary) {
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

          const nav = event.snapshot.data['nav'] as HeaderType;
          if (nav) {
            this.activeHeader = nav;
          }

          const backRouterPath = event.snapshot.data['backRouterPath'] as string;
          if (backRouterPath) {
            this.backRouterPath = backRouterPath;
          } else {
            this.backRouterPath = null;
          }
        }
      });

    this.route.queryParamMap.subscribe(params => {
      if (params.has('dialog') && params.get('dialog') === 'donation') {
        this.openPaymentDialog();
      }
    });
  }

  logout() {
    this.authService.removeToken();
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

  takeTour() {
    this.tutorialService.activateTutorial(TutorialType.ContextMenu);
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
          this.router.navigate([], { queryParams: { tut: TutorialType.ContextMenu } });
        });
    }
  }

  openPaymentDialog() {
    this.paymentDialogService.open();
  }

  openContextMenu() {
    if (this.bpService.isWeb) {
      this.contextMenuTrigger.openMenu();
    } else {
      this.contextMenuTrigger.closeMenu();

      this.preventBackNavigationService.beforeOpen();

      this.bottomSheet.open(this.bottomSheetContextMenu, {
        autoFocus: false,
        closeOnNavigation: true
      }).afterDismissed().subscribe(() => this.preventBackNavigationService.afterClosed());
    }
  }
}
