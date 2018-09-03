import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
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
    ...materialModules
  ],
  declarations: [
    SearchComponent
  ]
})
export class SearchModule { }
