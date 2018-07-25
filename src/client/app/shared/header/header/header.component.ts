import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatMenuTrigger, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TutorialType } from '../../../../../shared/view-models/tutorial/tutorial-type.enum';
import { TutorialService } from '../../../shared/tutorial/tutorial.service';
import { AuthService } from '../../auth.service';
import { BreakpointService } from '../../breakpoint.service';
import { PaymentDialogService } from '../../payment-dialog/payment-dialog.service';
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
  private isDarkTheme: boolean;
  private isDarkThemeStorageKey = 'is_dark_theme';
  hasNavigatedHomeBecauseOfEmptyReferrer = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private titleService: Title,
    private location: Location,
    private tutorialService: TutorialService,
    public snackBar: MatSnackBar,
    private paymentDialogService: PaymentDialogService,
    public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService) {
    this.checkHasVisited();
  }

  ngOnInit() {
    this.themeOnInit();

    this.authService.loggedInUserId$
      .subscribe(id => {
        this.loggedInUserId = id;
      });

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
          if (title !== null) {
            this.titleService.setTitle(title);
            this.headerBackTitle = title;
          }

          const nav = event.snapshot.data['nav'] as HeaderType;
          if (nav !== null) {
            this.activeHeader = nav;
          }

          const backRouterPath = event.snapshot.data['backRouterPath'] as string;
          if (backRouterPath !== null) {
            this.backRouterPath = backRouterPath;
          } else {
            this.backRouterPath = null;
          }
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
      if (document.referrer === '' && !this.hasNavigatedHomeBecauseOfEmptyReferrer) {
        this.hasNavigatedHomeBecauseOfEmptyReferrer = true;
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

  toggleTheme() {
    const darkThemeClass = 'dark-theme';

    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {
      document.querySelector('body').classList.add(darkThemeClass);
    } else {
      document.querySelector('body').classList.remove(darkThemeClass);
    }

    this.updateStoredTheme();
  }

  themeOnInit() {
    this.isDarkTheme = localStorage.getItem(this.isDarkThemeStorageKey) === 'true';
    this.isDarkTheme = !this.isDarkTheme;
    this.toggleTheme();
  }

  updateStoredTheme() {
    localStorage.setItem(this.isDarkThemeStorageKey, `${this.isDarkTheme}`);
  }

  openContextMenu() {
    if (this.bpService.isWeb) {
      this.contextMenuTrigger.openMenu();
    } else {
      this.contextMenuTrigger.closeMenu();
      this.bottomSheet.open(this.bottomSheetContextMenu, {
        autoFocus: false,
        closeOnNavigation: true
      });
    }
  }
}
