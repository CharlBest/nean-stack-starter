import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushSubscriptionViewModel } from '@shared/view-models/user/push-subscription.view-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private swPush: SwPush) { }

  subscribeToNotifications(onSuccess: (viewModel: PushSubscriptionViewModel) => void): void {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.publicVapidKey
      })
        .then(data => {
          const dataJson = data.toJSON();
          if (dataJson && dataJson.endpoint && dataJson.keys) {
            const viewModel = new PushSubscriptionViewModel(dataJson.endpoint, dataJson.keys.auth, dataJson.keys.p256dh);

            // Execute callback
            onSuccess(viewModel);
          } else {
            console.error('Push subscription data is invalid');
          }
        })
        .catch(error => console.error('Could not subscribe to notifications', error));
    } else {
      console.error('Service workers arent enabled on this device');
    }
  }

  isPushNotificationPermissionGrandted(): boolean {
    // TODO: At the moment this only supports 1 device which means the user will
    // receive push notifications on the device the toggle this switch on and it
    // will override any other devices that are registered to receive push notifications
    // The toggle state also doesn't represent that it is the current registered device
    // but only that this user has permitted the use of push notifcations
    return (Notification as any /*Notification*/).permission === 'granted';
  }
}
