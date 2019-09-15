import { Injectable, OnDestroy, VERSION as angularVersion } from '@angular/core';
import { VERSION as angularMaterialVersion } from '@angular/material/core';
import { NavigationEnd, Router } from '@angular/router';
import countly from 'countly-sdk-web';
import { Subscription } from 'rxjs';
import { version } from '../../../../../package.json';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService implements OnDestroy {

  private routerEventsSubscription: Subscription;
  private previousUrl: string;

  constructor(private router: Router) { }

  init() {
    this.initialize();
    this.trackRouterNavigation();
  }

  emitEvent(nameOfEvent: string, eventValues: { [key: string]: string } | null = null) {
    countly.q.push(['add_event', {
      key: nameOfEvent,
      // count: 1,
      // sum: 1.5,
      // dur: 30,
      segmentation: eventValues
    }]);
  }

  // TODO: add this to analytics to better track problemsgoo
  setUser(email: string, id: number) {
    countly.q.push(['user_details', {
      email,
      custom: {
        id
      }
    }]);
  }

  clearUser() {
    countly.q.push(['user_details', null]);
  }


  // Place this somehwere global to catch all
  logError(exception: object) {
    countly.q.push(['log_error', exception]);
  }

  // This is the default
  enableTracking() {
    countly.q.push(['opt_in']);
  }

  // TODO: allow users to toggle this
  disableTracking() {
    countly.q.push(['opt_out']);
  }

  // These gyrations are necessary to make the service e2e testable
  // and to disable ga tracking during e2e tests.
  private initialize() {
    if (countly) {
      // some default pre init
      countly.q = countly.q || [];

      // App key (app type is being set in index.html)
      let appKey: string | null = null;
      if ((window as any).appType === 'web') {
        appKey = environment.analytics.web;
      } else if ((window as any).appType === 'ios') {
        appKey = environment.analytics.ios;
      } else if ((window as any).appType === 'chromeextension') {
        appKey = environment.analytics.chromeExtension;
      } else {
        console.error('No analytics app key found');
      }

      // provide countly initialization parameters
      countly.app_key = appKey;
      countly.url = environment.analyticsServerEndpoint;
      countly.app_version = version;

      // Enable features
      countly.q.push(['track_sessions']);
      countly.q.push(['track_errors'], {
        appVersion: version,
        angularVersion,
        angularMaterialVersion
      });
      countly.q.push(['track_links']);
      countly.q.push(['track_forms']);
      countly.q.push(['collect_from_forms']);

      /* Enterprise:
      // countly.q.push(['track_scrolls']);
      // countly.q.push(['track_clicks']);
      */

      // Initialize
      countly.init();
    } else {
      console.error('Countly not found');
    }
  }

  private trackRouterNavigation() {
    this.routerEventsSubscription = this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          const url = location.pathname;
          if (url === this.previousUrl) {
            return;
          }
          this.previousUrl = url;
          countly.q.push(['track_pageview', url]);
        }
      });
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
