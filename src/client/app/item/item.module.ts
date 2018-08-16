import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './item/item.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    ItemRoutingModule,
    ...materialModules
  ],
  declarations: [
    ItemComponent
  ]
})
export class ItemModule { }
