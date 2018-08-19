import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatInputModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './item/item.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatInputModule,
  MatIconModule
];

@NgModule({
  imports: [
    CommonModule,
    ItemRoutingModule,
    ReactiveFormsModule,
    FormErrorsModule,
    ...materialModules,
  ],
  declarations: [
    ItemComponent
  ]
})
export class ItemModule { }
