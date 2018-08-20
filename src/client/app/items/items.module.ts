import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { ItemComponent } from './item/item.component';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items/items.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [
    CommonModule,
    ItemsRoutingModule,
    ReactiveFormsModule,
    FormErrorsModule,
    ...materialModules,
  ],
  declarations: [
    ItemComponent,
    ItemsComponent,
  ]
})
export class ItemsModule { }
