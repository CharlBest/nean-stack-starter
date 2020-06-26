import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SkeletonScreenComponent } from './skeleton-screen/skeleton-screen.component';

const materialModules = [
  MatCardModule,
];


@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  declarations: [
    SkeletonScreenComponent
  ],
  exports: [
    SkeletonScreenComponent
  ]
})
export class SkeletonScreenModule { }
