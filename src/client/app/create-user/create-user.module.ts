import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { CreateUserRoutingModule } from './create-user-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    CreateUserRoutingModule,
    ReactiveFormsModule,
    FormErrorsModule,
    PreloaderModule,
    ...materialModules,
  ],
  declarations: [
    CreateUserComponent
  ]
})
export class CreateUserModule { }
