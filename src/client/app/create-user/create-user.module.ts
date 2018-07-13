import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { CreateUserRoutingModule } from './create-user-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule
];

@NgModule({
  imports: [
    CommonModule,
    CreateUserRoutingModule,
    ReactiveFormsModule,
    FormErrorsModule,
    ...materialModules
  ],
  declarations: [
    CreateUserComponent
  ]
})
export class CreateUserModule { }
