import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IconsModule } from '../icons/icons.module';
import { FilterComponent } from './filter/filter.component';

const materialModules = [
  MatSnackBarModule,
  MatChipsModule,
];

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ...materialModules
  ],
  declarations: [
    FilterComponent
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterModule { }
