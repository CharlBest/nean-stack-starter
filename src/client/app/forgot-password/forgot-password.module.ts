import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { ForgotPasswordRoutingModule } from '../forgot-password/forgot-password-routing.module';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

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
