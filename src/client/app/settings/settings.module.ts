import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatRadioModule } from '@angular/material';
import { SettingsRoutingModule } from '../settings/settings-routing.module';
import { LanguageComponent } from './language/language.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PaymentsComponent } from './payments/payments.component';
import { SettingsService } from './settings.service';
import { SettingsComponent } from './settings/settings.component';
import { WebhooksComponent } from './webhooks/webhooks.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ],
  declarations: [
    SettingsComponent,
    NotificationsComponent,
    PaymentsComponent,
    WebhooksComponent,
    LanguageComponent
  ],
  providers: [
    SettingsService
  ]
})
export class SettingsModule { }
