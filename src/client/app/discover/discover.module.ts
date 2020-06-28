import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ItemModule } from '../item/item.module';
import { InfiniteScrollModule } from '../shared/infinite-scroll/infinite-scroll.module';
import { DiscoverRoutingModule } from './discover-routing.module';
import { DiscoverComponent } from './discover/discover.component';

const materialModules = [
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    DiscoverRoutingModule,
    ItemModule,
    InfiniteScrollModule,
    ...materialModules
  ],
  declarations: [
    DiscoverComponent
  ]
})
export class DiscoverModule { }
