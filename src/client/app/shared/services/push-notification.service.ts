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

  private updatePushNotificationDetails(viewModel: PushSubscriptionModel): Observable<void> {
    console.log(viewModel);
    return this.http.put<void>(`${environment.apiUrlEndpoint}${UserRoutes.updatePushSubscription().client()}`, viewModel);
  }

  subscribeToNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.publicVapidKey
      })
        .then(data => {
          const dataJson = data.toJSON();
          if (dataJson && dataJson.endpoint && dataJson.keys) {
            const viewModel = new PushSubscriptionModel(dataJson.endpoint, dataJson.keys['auth'], dataJson.keys['p256dh']);
            this.updatePushNotificationDetails(viewModel).subscribe();
          } else {
            console.error('Push subscription data is invalid');
          }
        })
        .catch(error => console.error('Could not subscribe to notifications', error));
    } else {
      console.error('Service workers arent enabled on this device');
    }
  }
}
