import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
];

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    ...materialModules
  ],
  declarations: [
    SearchComponent
  ]
})
export class SearchModule { }
