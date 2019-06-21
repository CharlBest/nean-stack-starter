import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NetworkStatusComponent } from './network-status/network-status.component';

const materialModules = [
  MatCardModule,
  MatIconModule,
  MatSnackBarModule,
];

@NgModule({
  imports: [
    CommonModule,
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
