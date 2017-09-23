import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { LoggerService } from './logger.service';

@Injectable()
export class GaService {

  static initializeDelay = 1000;

  private previousUrl: string;
  private ga: (...rest: any[]) => void;

  constructor(private logger: LoggerService) {
    this.initializeGa();

    if (window['appType'] === 'web') {
      this.ga('create', environment.googleAnalytics.web, 'auto');
    } else if (window['appType'] === 'ios') {
      this.ga('create', environment.googleAnalytics.ios, 'auto');
    } else if (window['appType'] === 'chromeextension') {
      this.ga('create', environment.googleAnalytics.chromeExtension, 'auto');
    }
  }

  locationChanged(url: string) {
    this.sendPage(url);
  }

  sendPage(url: string) {
    if (url === this.previousUrl) { return; }
    this.previousUrl = url;
    this.ga('set', 'page', '/' + url);
    this.ga('send', 'pageview');
  }

  // These gyrations are necessary to make the service e2e testable
  // and to disable ga tracking during e2e tests.
  private initializeGa() {
    const ga = window['ga'];
    if (ga) {
      // Queue commands until GA analytics script has loaded.
      const gaQueue: any[][] = [];
      this.ga = (...rest: any[]) => { gaQueue.push(rest); };

      // Then send queued commands to either real or e2e test ga();
      // after waiting to allow possible e2e test to replace global ga function
      ga(() => setTimeout(() => {
        // this.logger.log('GA fn:', window['ga'].toString());
        this.ga = window['ga'];
        gaQueue.forEach((command) => this.ga.apply(null, command));
      }, GaService.initializeDelay));

    } else {
      // delegate `ga` calls to the logger if no ga installed
      this.ga = (...rest: any[]) => { this.logger.log('ga:', rest); };
    }
  }

  emitEvent(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
    this.ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
