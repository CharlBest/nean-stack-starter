import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { BreakpointService } from '../services/breakpoint.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  isOffline$: Subject<boolean> = new BehaviorSubject<boolean>(false);
  isConnectionFast$: Subject<boolean> = new BehaviorSubject<boolean>(true);
  openSnackBarRef: MatSnackBarRef<SimpleSnackBar>;

  constructor(private snackBar: MatSnackBar,
    private bpService: BreakpointService) { }

  init(): void {
    window.onload = () => {
      this.handleOnlineStatus();
      this.handleConnectionSpeed();
    };
  }

  handleOnlineStatus(): void {
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
  handleConnectionSpeed(): void {
    const onConnectionChange = () => {
      const { effectiveType } = (navigator as any).connection;
      let isFast = true;

      // Add 3g to test if 3G is considered to be slow
      if (/\slow-2g|2g/.test(effectiveType)) {
        isFast = false;
        this.openSnackBarRef = this.snackBar.open('Slow connection', undefined, {
          verticalPosition: this.bpService.isDesktop ? 'bottom' : 'top'
        });
      } else if (this.openSnackBarRef) {
        this.openSnackBarRef.dismiss();
      }

      this.isConnectionFast$.next(isFast);
    };

    onConnectionChange();

    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', onConnectionChange);
    }
  }
}
