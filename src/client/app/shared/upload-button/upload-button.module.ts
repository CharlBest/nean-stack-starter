import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaTypeComponent } from '../../shared/media-type/media-type/media-type.component';
import { UploadButtonComponent } from './upload-button/upload-button.component';
import { UploadButtonService } from './upload-button.service';
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
    MatTooltipModule
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
