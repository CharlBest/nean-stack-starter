import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MediaModule } from '../media/media.module';
import { FileDropComponent } from './file-drop/file-drop.component';
import { UploadButtonComponent } from './upload-button/upload-button.component';

const materialModules = [
  MatButtonModule,
  MatProgressBarModule,
  MatTooltipModule,
];

@NgModule({
  imports: [
    CommonModule,
    MediaModule,
    ...materialModules
  ],
  declarations: [
    UploadButtonComponent,
    FileDropComponent
  ],
  exports: [
    UploadButtonComponent,
    FileDropComponent
  ]
})
export class UploadButtonModule { }
