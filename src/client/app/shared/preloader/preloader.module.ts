import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloaderComponent } from './preloader/preloader.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PreloaderComponent
  ],
  exports: [
    PreloaderComponent
  ]
})
export class PreloaderModule { }
