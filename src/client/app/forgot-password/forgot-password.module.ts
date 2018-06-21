import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { ForgotPasswordRoutingModule } from '../forgot-password/forgot-password-routing.module';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    ShowErrorsModule,
    TutorialModule,
    ...materialModules
  ],
  declarations: [
    ForgotPasswordComponent,
    ChangePasswordComponent,
  ]
})
export class ForgotPasswordModule { }
