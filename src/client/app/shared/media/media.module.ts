import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { MediaComponent } from '../../shared/media/media/media.component';
import { ImgErrorDirective } from './img-error.directive';
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
    ImgErrorDirective
  ],
  exports: [
    MediaComponent
  ],
  entryComponents: [
    ViewMediaDialogComponent
  ]
})
export class MediaModule { }
