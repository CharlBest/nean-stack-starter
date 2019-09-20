import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageFileDirective } from './image-file.directive';
import { ImgErrorDirective } from './img-error.directive';
import { MediaComponent } from './media/media.component';
import { ViewMediaDialogComponent } from './view-media-dialog/view-media-dialog.component';

const materialModules = [
  MatDialogModule,
  MatButtonModule
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  declarations: [
    MediaComponent,
    ViewMediaDialogComponent,
    ImgErrorDirective,
    ImageFileDirective
  ],
  exports: [
    MediaComponent,
    ImageFileDirective
  ],
  entryComponents: [
    ViewMediaDialogComponent
  ]
})
export class MediaModule { }
