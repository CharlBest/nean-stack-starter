import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { PushSubscriptionModel } from '../../../../shared/models/user/push-subscription.model';
import { UserRoutes } from '../../../../shared/routes/user.routes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private swPush: SwPush,
    private http: HttpClient) { }

  private updatePushNotificationDetails(viewModel: PushSubscriptionModel | null): Observable<void> {
    console.log(viewModel);
    return this.http.put<void>(`${environment.apiUrlEndpoint}${UserRoutes.updatePushSubscription().client()}`, viewModel);
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: environment.publicVapidKey
    })
      .then(data => this.updatePushNotificationDetails(<any>data).subscribe())
      .catch(error => console.error('Could not subscribe to notifications', error));
  }
}
