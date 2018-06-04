import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageComponent } from '../settings/language/language.component';
import { NotificationsComponent } from '../settings/notifications/notifications.component';
import { PaymentsComponent } from '../settings/payments/payments.component';
import { SettingsComponent } from '../settings/settings/settings.component';
import { WebhooksComponent } from '../settings/webhooks/webhooks.component';
import { Navigation } from '../shared/navigation/navigation/navigation.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SettingsComponent, pathMatch: 'full', data: { title: 'Settings', nav: Navigation.Back } },
            { path: 'notifications', component: NotificationsComponent, pathMatch: 'full', data: { title: 'Notifications', nav: Navigation.Back } },
            { path: 'payments', component: PaymentsComponent, pathMatch: 'full', data: { title: 'Payments', nav: Navigation.Back } },
            { path: 'webhooks', component: WebhooksComponent, pathMatch: 'full', data: { title: 'Webhooks', nav: Navigation.Back } },
            { path: 'language', component: LanguageComponent, pathMatch: 'full', data: { title: 'Language', nav: Navigation.Back } },
        ])
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
