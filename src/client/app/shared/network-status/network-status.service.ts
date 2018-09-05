import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  isOffline$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  init() {
    window.onload = () => {
      const handleNetworkChange = () => {
        this.isOffline$.next(!navigator.onLine);
      };

      handleNetworkChange();

      window.addEventListener('online', handleNetworkChange);
      window.addEventListener('offline', handleNetworkChange);
    };
  }
}
