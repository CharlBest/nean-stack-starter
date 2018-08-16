import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { DialogModule } from '../shared/dialog/dialog.module';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatDialogModule
];

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    TutorialModule,
    FormErrorsModule,
    DialogModule,
    ...materialModules,
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
