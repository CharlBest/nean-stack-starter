import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { GaService } from './shared/services/ga.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private gaService: GaService) {
    // Firebase
    initializeApp({
      storageBucket: environment.firebase.storageBucket
    }, environment.firebase.projectId);
  }
}
