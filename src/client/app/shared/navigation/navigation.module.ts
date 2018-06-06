import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule, MatButtonModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatSnackBarModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TutorialModule } from '../../shared/tutorial/tutorial.module';
import { PaymentDialogModule } from '../payment-dialog/payment-dialog.module';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    TutorialModule,
    PaymentDialogModule,
    MatToolbarModule,
    MatListModule,
    MatBottomSheetModule
  ],
  exports: [
    NavigationComponent
  ],
  declarations: [
    NavigationComponent
  ]
})
export class NavigationModule { }
