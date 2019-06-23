import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IconsModule } from '../shared/icons/icons.module';
import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyComponent } from './verify/verify.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    VerifyRoutingModule,
    IconsModule,
    ...materialModules
  ],
  declarations: [
    VerifyComponent
  ]
})
export class VerifyModule { }
