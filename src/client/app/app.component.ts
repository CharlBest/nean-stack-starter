import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { GaService } from './shared/ga.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public router: Router,
    public gaService: GaService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.gaService.locationChanged(event.urlAfterRedirects);
      }
    });
  }
}
