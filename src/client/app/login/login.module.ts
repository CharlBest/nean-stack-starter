import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { LoginRoutingModule } from '../login/login-routing.module';
import { FormService } from '../shared/form.service';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { LoginService } from './login.service';
import { LoginComponent } from './login/login.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    ShowErrorsModule,
    TutorialModule,
    ...materialModules
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
