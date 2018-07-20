import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyComponent } from './verify/verify.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatIconModule,
];

@NgModule({
  imports: [
    CommonModule,
    VerifyRoutingModule,
    ...materialModules
  ],
  declarations: [
    VerifyComponent
  ]
})
export class VerifyModule { }
