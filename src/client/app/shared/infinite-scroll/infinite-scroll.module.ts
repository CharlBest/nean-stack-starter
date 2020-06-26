import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloaderModule } from '../preloader/preloader.module';
import { SkeletonScreenModule } from '../skeleton-screen/skeleton-screen.module';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';

@NgModule({
  imports: [
    CommonModule,
    PreloaderModule,
    SkeletonScreenModule,
  ],
  declarations: [
    InfiniteScrollComponent
  ],
  exports: [
    InfiniteScrollComponent
  ]
})
export class InfiniteScrollModule { }
