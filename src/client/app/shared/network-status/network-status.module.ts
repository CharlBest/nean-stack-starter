import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IconsModule } from '../icons/icons.module';
import { NetworkStatusComponent } from './network-status/network-status.component';

const materialModules = [
  MatCardModule,
  MatSnackBarModule,
];

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ...materialModules
  ],
  declarations: [
    NetworkStatusComponent
  ],
  exports: [
    NetworkStatusComponent
  ]
})
export class NetworkStatusModule { }
