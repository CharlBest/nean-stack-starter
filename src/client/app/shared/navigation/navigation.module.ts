import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { TutorialModule } from '../../shared/tutorial/tutorial.module';
import { PaymentDialogModule } from '../payment-dialog/payment-dialog.module';
import {
  MatTabsModule,
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatSnackBarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
    TutorialModule,
    PaymentDialogModule
  ],
  exports: [
    NavigationComponent
  ],
  declarations: [
    NavigationComponent
  ]
})
export class NavigationModule { }
