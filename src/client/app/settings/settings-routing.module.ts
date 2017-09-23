import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../navigation/navigation/navigation.component';
import { SettingsComponent } from '../settings/settings/settings.component';
import { NotificationsComponent } from '../settings/notifications/notifications.component';
import { PaymentsComponent } from '../settings/payments/payments.component';
import { WebhooksComponent } from '../settings/webhooks/webhooks.component';
import { LanguageComponent } from '../settings/language/language.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'notifications', component: NotificationsComponent, data: { title: 'Notifications', nav: Navigation.Back } },
            { path: 'payments', component: PaymentsComponent, data: { title: 'Payments', nav: Navigation.Back } },
            { path: 'webhooks', component: WebhooksComponent, data: { title: 'Webhooks', nav: Navigation.Back } },
            { path: 'language', component: LanguageComponent, data: { title: 'Language', nav: Navigation.Back } },
            { path: '', component: SettingsComponent, data: { title: 'Settings', nav: Navigation.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
