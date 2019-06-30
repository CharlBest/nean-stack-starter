import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemModule } from '../item/item.module';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { IconsModule } from '../shared/icons/icons.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    ReactiveFormsModule,
    FormErrorsModule,
    IconsModule,
    ItemModule,
    ...materialModules
  ],
  declarations: [
    SearchComponent
  ]
})
export class SearchModule { }
