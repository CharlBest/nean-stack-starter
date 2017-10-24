import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from './verify/verify.component';
import { VerifyRoutingModule } from '../verify/verify-routing.module';
import { VerifyService } from './verify.service';
import {
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatIconModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    VerifyRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  declarations: [
    VerifyComponent
  ],
  providers: [
    VerifyService
  ]
})
export class VerifyModule { }
