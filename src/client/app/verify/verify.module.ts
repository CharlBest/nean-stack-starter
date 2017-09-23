import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from './verify/verify.component';
import { VerifyRoutingModule } from '../verify/verify-routing.module';
import { MdButtonModule, MdCardModule, MdProgressSpinnerModule, MdIconModule } from '@angular/material';
import { VerifyService } from './verify.service';

@NgModule({
  imports: [
    CommonModule,
    VerifyRoutingModule,
    MdButtonModule,
    MdCardModule,
    MdProgressSpinnerModule,
    MdIconModule
  ],
  declarations: [
    VerifyComponent
  ],
  providers: [
    VerifyService
  ]
})
export class VerifyModule { }
