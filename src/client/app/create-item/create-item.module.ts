import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { CreateItemRoutingModule } from './create-item-routing.module';
import { CreateItemComponent } from './create-item/create-item.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    CreateItemRoutingModule,
    ...materialModules
  ],
  declarations: [
    CreateItemComponent
  ]
})
export class CreateItemModule { }
