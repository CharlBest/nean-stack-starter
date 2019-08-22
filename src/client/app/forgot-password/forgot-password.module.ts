import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { IconsModule } from '../shared/icons/icons.module';
import { PasswordExposeModule } from '../shared/password-expose/password-expose.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    TutorialModule,
    FormErrorsModule,
    PreloaderModule,
    IconsModule,
    PasswordExposeModule,
    ...materialModules
  ],
  declarations: [
    ForgotPasswordComponent,
    ChangePasswordComponent,
  ]
})
export class ForgotPasswordModule { }
