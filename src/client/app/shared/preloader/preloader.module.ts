import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreloaderComponent } from './preloader/preloader.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    PreloaderComponent
  ],
  exports: [
    PreloaderComponent
  ]
})
export class PreloaderModule { }
