import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { CreateItemRoutingModule } from './create-item-routing.module';
import { CreateItemComponent } from './create-item/create-item.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    CreateItemRoutingModule,
    ReactiveFormsModule,
    FormErrorsModule,
    ...materialModules
  ],
  declarations: [
    CreateItemComponent
  ]
})
export class CreateItemModule { }
