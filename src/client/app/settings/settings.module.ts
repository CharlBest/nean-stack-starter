import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatRadioModule } from '@angular/material';
import { LanguageComponent } from './language/language.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatRadioModule,
  MatListModule,
  MatIconModule,
];

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ...materialModules
  ],
  declarations: [
    SettingsComponent,
    LanguageComponent,
    NotificationsComponent,
  ]
})
export class SettingsModule { }
