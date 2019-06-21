import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Error404RoutingModule } from './error-404-routing.module';
import { Error404Component } from './error-404/error-404.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    Error404RoutingModule,
    ...materialModules
  ],
  declarations: [
    Error404Component
  ]
})
export class Error404Module { }
