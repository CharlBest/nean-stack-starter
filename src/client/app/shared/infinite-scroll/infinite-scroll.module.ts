import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloaderModule } from '../preloader/preloader.module';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';

@NgModule({
  imports: [
    CommonModule,
    PreloaderModule
  ],
  declarations: [
    InfiniteScrollComponent
  ],
  exports: [
    InfiniteScrollComponent
  ]
})
export class InfiniteScrollModule { }
