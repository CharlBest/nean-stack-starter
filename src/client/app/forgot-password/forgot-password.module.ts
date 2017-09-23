import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MdProgressSpinnerModule, MdInputModule, MdButtonModule, MdCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordRoutingModule } from '../forgot-password/forgot-password-routing.module';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdCardModule,
    ShowErrorsModule
  ],
  declarations: [
    ForgotPasswordComponent,
    ChangePasswordComponent,
  ],
  providers: [
    ForgotPasswordService
  ]
})
export class ForgotPasswordModule { }
