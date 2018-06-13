import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TutorialModule } from '../../shared/tutorial/tutorial.module';
import { PaymentDialogModule } from '../payment-dialog/payment-dialog.module';
import { HeaderComponent } from './header/header.component';

const materialModules = [
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatListModule,
  MatBottomSheetModule,
  MatBadgeModule,
  MatTooltipModule
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
    HeaderComponent
  ],
  declarations: [
    HeaderComponent
  ]
})
export class HeaderModule { }
