import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatProgressSpinnerModule, MatInputModule, MatButtonModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordRoutingModule } from '../forgot-password/forgot-password-routing.module';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ShowErrorsModule,
    TutorialModule
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
