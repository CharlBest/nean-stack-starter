import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IconsModule } from '../shared/icons/icons.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyComponent } from './verify/verify.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    VerifyRoutingModule,
    IconsModule,
    PreloaderModule,
    ...materialModules
  ],
  declarations: [
    VerifyComponent
  ]
})
export class VerifyModule { }
