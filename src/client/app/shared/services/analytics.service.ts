import { Injectable, OnDestroy, VERSION as angularVersion } from '@angular/core';
import { VERSION as angularMaterialVersion } from '@angular/material/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenViewModel } from '@shared/view-models/create-user/token.view-model';
import countly from 'countly-sdk-web';
import { Subscription } from 'rxjs';
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';
import { version } from '../../../../../package.json';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService implements OnDestroy {

  private routerEventsSubscription: Subscription;
  private previousUrl: string;

  constructor(private router: Router) { }

  init(): void {
    this.initialize();
    this.setWebVitals();
    this.trackRouterNavigation();
  }

  setWebVitals(): void {
    getCLS(metric => this.reportTrace('device', 'cumulative-layout-shift', metric));
    getFCP(metric => this.reportTrace('device', 'first-contentful-paint', metric));
    getFID(metric => this.reportTrace('device', 'first-input-delay', metric));
    getLCP(metric => this.reportTrace('device', 'largest-contentful-paint', metric));
    getTTFB(metric => {
      const requestTime = metric.value - metric.entries[0].startTime;
      this.reportTrace('network', 'reduce-server-response-times', {
        requestTime,
        ...metric
      });
    });
  }

  emitEvent(nameOfEvent: string, eventValues: { [key: string]: string } | null = null): void {
    this.push(['add_event', {
      key: nameOfEvent,
      // count: 1,
      // sum: 1.5,
      // dur: 30,
      segmentation: eventValues
    }]);
  }

  setUser(id: number | null, model: TokenViewModel): void {
    this.push(['user_details', {
      email: model.email,
      username: model.username,
      custom: {
        id,
        ...model
      }
    }]);
  }

  clearUser(): void {
    this.push(['user_details', {}]);
  }

  // Place this somehwere global to catch all
  logError(exception: object): void {
    this.push(['log_error', exception]);
  }

  // This is the default
  enableTracking(): void {
    this.push(['opt_in']);
  }

  // TODO: allow users to toggle this
  disableTracking(): void {
    this.push(['opt_out']);
  }

  // TODO: Add rating
  reportFeedback(comment: string, userId?: number | null, rating?: number): void {
    this.push(['report_feedback', {
      widget_id: '1',
      contactMe: false,
      rating,
      email: userId ? userId.toString() : null,
      comment
    }]);
  }

  // These gyrations are necessary to make the service e2e testable
  // and to disable ga tracking during e2e tests.
  private initialize(): void {
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
      this.push(['track_sessions']);
      this.push(['track_errors'], {
        appVersion: version,
        angularVersion,
        angularMaterialVersion
      });
      this.push(['track_links']);
      this.push(['track_forms']);
      this.push(['collect_from_forms']);
      this.push(['report_conversion']);

      /* Enterprise:
      // this.push(['track_scrolls']);
      // this.push(['track_clicks']);
      */

      // Initialize
      countly.init();
    } else {
      console.error('Countly not found');
    }
  }

  private trackRouterNavigation(): void {
    this.routerEventsSubscription = this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          const url = location.pathname;
          if (url === this.previousUrl) {
            return;
          }
          this.previousUrl = url;
          this.push(['track_pageview', url]);
        }
      });
  }

  private push(event: Array<unknown>, args: object | null = null): void {
    try {
      countly.q.push(event, args);
    } catch (e) {
      console.error(e);
    }
  }

  private reportTrace(type: 'device' | 'network', name: string, metrics: object): void {
    this.push(['report_trace', {
      type, // device or network
      name, // use name to identify trace and group them by
      stz: new Date().getTime(), // start timestamp in miliseconds
      etz: new Date().getTime(), // end timestamp in miliseconds
      app_metrics: {
        ...metrics
      }
    }]);
  }

  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
