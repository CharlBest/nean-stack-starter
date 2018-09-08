import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  isOffline$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private snackBar: MatSnackBar) { }

  init() {
    window.onload = () => {
      const handleNetworkChange = () => {
        if (!navigator.onLine) {
          this.snackBar.open('Offline');
        }

        this.isOffline$.next(!navigator.onLine);
      };

      handleNetworkChange();

      window.addEventListener('online', handleNetworkChange);
      window.addEventListener('offline', handleNetworkChange);
    };
  }
}
