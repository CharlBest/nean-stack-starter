import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushSubscriptionViewModel } from '../../../../shared/view-models/user/push-subscription.view-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private swPush: SwPush) { }

  subscribeToNotifications(callback: Function) {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.publicVapidKey
      })
        .then(data => {
          const dataJson = data.toJSON();
          if (dataJson && dataJson.endpoint && dataJson.keys) {
            const viewModel = new PushSubscriptionViewModel(dataJson.endpoint, dataJson.keys['auth'], dataJson.keys['p256dh']);
            callback(viewModel);
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
