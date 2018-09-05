import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatIconModule, MatSnackBarModule } from '@angular/material';
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
