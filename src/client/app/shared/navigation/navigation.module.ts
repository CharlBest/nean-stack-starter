import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentDialogModule } from '../payment-dialog/payment-dialog.module';
import { TutorialModule } from '../tutorial/tutorial.module';
import { NavigationComponent } from './navigation/navigation.component';

const materialModules = [
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatListModule,
  MatBottomSheetModule,
  MatTooltipModule,
  MatCardModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TutorialModule,
    PaymentDialogModule,
    NotificationsModule,
    ...materialModules
  ],
  exports: [
    NavigationComponent
  ],
  declarations: [
    NavigationComponent
  ]
})
export class NavigationModule { }
