import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
