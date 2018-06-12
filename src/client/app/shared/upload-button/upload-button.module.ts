import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatProgressBarModule, MatTooltipModule } from '@angular/material';
import { MediaModule } from '../media/media.module';
import { UploadButtonService } from './upload-button.service';
import { UploadButtonComponent } from './upload-button/upload-button.component';

const materialModules = [
  MatDialogModule,
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
