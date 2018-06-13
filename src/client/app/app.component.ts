import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { BreakpointService } from './shared/breakpoint.service';
import { GaService } from './shared/ga.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private gaService: GaService,
    public bpService: BreakpointService) {
    // Firebase
    initializeApp({
      apiKey: environment.firebase.apiKey,
      authDomain: environment.firebase.authDomain,
      databaseURL: environment.firebase.databaseURL,
      storageBucket: environment.firebase.storageBucket
    }, environment.firebase.projectId);
  }
}
