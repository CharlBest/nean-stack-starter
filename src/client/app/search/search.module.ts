import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ItemModule } from '../item/item.module';
import { InfiniteScrollModule } from '../shared/infinite-scroll/infinite-scroll.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';

const materialModules = [
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    ItemModule,
    InfiniteScrollModule,
    ...materialModules
  ],
  declarations: [
    SearchComponent
  ]
})
export class SearchModule { }
