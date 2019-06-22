import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  private initializeDelay = 1000;
  private previousUrl: string;
  private ga: (...rest: any[]) => void;

  constructor(private logger: LoggerService,
    private router: Router) { }

  private locationChanged(url: string) {
    this.sendPage(url);
  }

  private sendPage(url: string) {
    if (url === this.previousUrl) { return; }
    this.previousUrl = url;
    this.ga('set', 'page', '/' + url);
    this.ga('send', 'pageview');
  }

  // These gyrations are necessary to make the service e2e testable
  // and to disable ga tracking during e2e tests.
  private initializeGa() {
    const ga = (window as any).ga;
    if (ga) {
      // Queue commands until GA analytics script has loaded.
      const gaQueue: any[][] = [];
      this.ga = (...rest: any[]) => { gaQueue.push(rest); };

      // Then send queued commands to either real or e2e test ga();
      // after waiting to allow possible e2e test to replace global ga function
      ga(() => setTimeout(() => {
        // this.logger.log('GA fn:', (window as any).toString());
        this.ga = (window as any).ga;
        gaQueue.forEach((command) => this.ga.apply(null, command));
      }, this.initializeDelay));

    } else {
      // delegate `ga` calls to the logger if no ga installed
      this.ga = (...rest: any[]) => { this.logger.log('ga:', rest); };
    }
  }

  private trackRouterNavigation() {
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.locationChanged(event.urlAfterRedirects);
        }
      });
  }

  init() {
    this.initializeGa();

    if ((window as any).appType === 'web') {
      this.ga('create', environment.googleAnalytics.web, 'auto');
    } else if ((window as any).appType === 'ios') {
      this.ga('create', environment.googleAnalytics.ios, 'auto');
    } else if ((window as any).appType === 'chromeextension') {
      this.ga('create', environment.googleAnalytics.chromeExtension, 'auto');
    }

    this.trackRouterNavigation();
  }

  emitEvent(eventCategory: string, eventAction: string, eventLabel: string | null = null, eventValue: number | null = null) {
    this.ga('send', 'event', {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue
    });
  }
}
