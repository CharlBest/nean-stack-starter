import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { VerifyRoutingModule } from '../verify/verify-routing.module';
import { VerifyService } from './verify.service';
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
  ],
  providers: [
    VerifyService
  ]
})
export class VerifyModule { }
