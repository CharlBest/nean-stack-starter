import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatProgressSpinnerModule } from '@angular/material';
import { ItemModule } from '../item/item.module';
import { GitHubModule } from '../shared/github/github.module';
import { NetworkStatusModule } from '../shared/network-status/network-status.module';
import { GitHubReadMeComponent } from './github-readme/github-readme.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  ScrollingModule,
];

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ItemModule,
    GitHubModule,
    NetworkStatusModule,
    ...materialModules
  ],
  declarations: [
    HomeComponent,
    GitHubReadMeComponent,
  ]
})
export class HomeModule { }
