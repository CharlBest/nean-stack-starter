import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatSnackBarModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TutorialModule } from '../../shared/tutorial/tutorial.module';
import { PaymentDialogModule } from '../payment-dialog/payment-dialog.module';
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
  MatBadgeModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TutorialModule,
    PaymentDialogModule,
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
