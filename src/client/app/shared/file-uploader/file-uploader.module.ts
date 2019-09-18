import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsModule } from '../icons/icons.module';
import { MediaModule } from '../media/media.module';
import { UploadButtonComponent } from './file-uploader/file-uploader.component';

const materialModules = [
  MatButtonModule,
  MatProgressBarModule,
  MatTooltipModule,
];

@NgModule({
  imports: [
    CommonModule,
    MediaModule,
    IconsModule,
    ...materialModules
  ],
  declarations: [
    UploadButtonComponent
  ],
  exports: [
    UploadButtonComponent
  ]
})
export class UploadButtonModule { }
