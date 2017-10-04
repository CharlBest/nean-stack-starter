import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from '../login/login-routing.module';
import { LoginService } from './login.service';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';
import { FormService } from '../shared/form.service';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import {
  MdButtonModule,
  MdCardModule,
  MdInputModule,
  MdProgressSpinnerModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdProgressSpinnerModule,
    ReactiveFormsModule,
    ShowErrorsModule,
    TutorialModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    LoginService,
    FormService
  ]
})
export class LoginModule { }
