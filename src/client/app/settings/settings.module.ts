import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatRadioModule } from '@angular/material';
import { SettingsRoutingModule } from '../settings/settings-routing.module';
import { LanguageComponent } from './language/language.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PaymentsComponent } from './payments/payments.component';
import { SettingsComponent } from './settings/settings.component';
import { WebhooksComponent } from './webhooks/webhooks.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatRadioModule
];

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ...materialModules
  ],
  declarations: [
    SettingsComponent,
    NotificationsComponent,
    PaymentsComponent,
    WebhooksComponent,
    LanguageComponent
  ],
  providers: []
})
export class SettingsModule { }
