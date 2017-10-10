import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaTypeComponent } from '../../shared/media-type/media-type/media-type.component';
import { ViewMediaDialogComponent } from './view-media-dialog/view-media-dialog.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { ImgErrorDirective } from './img-error.directive';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [
    MediaTypeComponent,
    ViewMediaDialogComponent,
    ImgErrorDirective
  ],
  exports: [
    MediaTypeComponent
  ],
  entryComponents: [
    ViewMediaDialogComponent
  ]
})
export class MediaTypeModule { }
