import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
];

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    TutorialModule,
    FormErrorsModule,
    PreloaderModule,
    ...materialModules,
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
