import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloaderModule } from '../preloader/preloader.module';
import { OverscrollComponent } from './overscroll/overscroll.component';

@NgModule({
  imports: [
    CommonModule,
    PreloaderModule,
  ],
  declarations: [
    OverscrollComponent
  ],
  exports: [
    OverscrollComponent
  ]
})
export class OverscrollModule { }
