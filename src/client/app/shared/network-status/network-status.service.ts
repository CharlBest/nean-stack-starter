import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  isOffline$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  isConnectionFast$: Subject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private snackBar: MatSnackBar) { }

  init() {
    window.onload = () => {
      this.handleOnlineStatus();
      this.handleConnectionSpeed();
    };
  }

  handleOnlineStatus() {
    const onNetworkChange = () => {
      if (!navigator.onLine) {
        this.snackBar.open('Offline');
      }

      this.isOffline$.next(!navigator.onLine);
    };

    onNetworkChange();

    window.addEventListener('online', onNetworkChange);
    window.addEventListener('offline', onNetworkChange);
  }

  // TODO: use to blur images when connection is slow or lazy load more things
  handleConnectionSpeed() {
    const onConnectionChange = () => {
      const { effectiveType } = (navigator as any).connection;
      let isFast = true;

      // Add 3g to test if 3G is considered to be slow
      if (/\slow-2g|2g/.test(effectiveType)) {
        isFast = false;
        this.snackBar.open('Slow connection');
      }

      this.isConnectionFast$.next(isFast);
    };

    onConnectionChange();

    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', onConnectionChange);
    }
  }
}
