import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule, MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { CommentsComponent } from './comments/comments.component';
import { ItemComponent } from './item/item.component';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items/items.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatListModule,
  MatBottomSheetModule,
  MatTooltipModule
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
    CommentsComponent,
  ]
})
export class ItemsModule { }
