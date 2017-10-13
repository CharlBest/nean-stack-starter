import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadButtonComponent } from './upload-button/upload-button.component';
import { UploadButtonService } from './upload-button.service';
import { MediaModule } from '../media/media.module';
import {
  MatDialogModule,
  MatButtonModule,
  MatProgressBarModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    MediaModule
  ],
  declarations: [
    UploadButtonComponent
  ],
  providers: [
    UploadButtonService
  ],
  exports: [
    UploadButtonComponent
  ]
})
export class UploadButtonModule { }
