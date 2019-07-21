import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ItemModule } from '../item/item.module';
import { GitHubModule } from '../shared/github/github.module';
import { InfiniteScrollModule } from '../shared/infinite-scroll/infinite-scroll.module';
import { NetworkStatusModule } from '../shared/network-status/network-status.module';
import { GitHubReadMeComponent } from './github-readme/github-readme.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatSnackBarModule
];

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ItemModule,
    GitHubModule,
    NetworkStatusModule,
    InfiniteScrollModule,
    ...materialModules
  ],
  declarations: [
    HomeComponent,
    GitHubReadMeComponent,
  ]
})
export class HomeModule { }
