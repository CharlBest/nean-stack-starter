import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { VerifyRoutingModule } from '../verify/verify-routing.module';
import { VerifyService } from './verify.service';
import { VerifyComponent } from './verify/verify.component';

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
