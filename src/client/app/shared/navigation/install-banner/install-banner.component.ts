import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PWAService } from '../../pwa-helper/pwa.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-install-banner',
  templateUrl: './install-banner.component.html',
  styleUrls: ['./install-banner.component.scss']
})
export class InstallBannerComponent implements OnInit, OnDestroy {

  @Input() toolbarHeight: number;
  @Output() readonly showInstallBanner: EventEmitter<boolean> = new EventEmitter<boolean>();
  private routerEventsSubscription: Subscription;

  constructor(public navigationService: NavigationService,
    public pwaService: PWAService,
    private router: Router) { }

  ngOnInit() {
    this.navigationService.showInstallBanner = this.pwaService.canInstallAndNotInPWA;

    // Uncomment if pwa install banner should be shown immediately when possible
    // Watch for before install prompt to show install banner
    // this.pwaService.beforeInstallPromptChange.subscribe(() => {
    //   if (this.pwaService.canInstallAndNotInPWA) {
    //     this.updateInstallBanner(true);
    //   }
    // });

    this.trackNavigationCount();
  }

  updateInstallBanner(canShowInstallBanner: boolean) {
    this.navigationService.showInstallBanner = canShowInstallBanner;
    this.showInstallBanner.emit(canShowInstallBanner);
  }

  private trackNavigationCount() {
    let count = 0;
    this.routerEventsSubscription = this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          count++;
          // Show banner when you have at least navigated 3 times
          if (count === 3 && this.pwaService.canInstallAndNotInPWA) {
            this.updateInstallBanner(true);
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
