import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { NotificationsComponent } from './notifications/notifications.component';

const materialModules = [
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule
];

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    ...materialModules
  ],
  declarations: [
    NotificationsComponent
  ],
  exports: [
    NotificationsComponent
  ],
  entryComponents: [
    NotificationsComponent
  ]
})
export class NotificationsModule { }
