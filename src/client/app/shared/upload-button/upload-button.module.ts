import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaTypeComponent } from '../../shared/media-type/media-type/media-type.component';
import { MdDialogModule, MdButtonModule } from '@angular/material';
import { UploadButtonComponent } from './upload-button/upload-button.component';

@NgModule({
  imports: [
    CommonModule,
    MdDialogModule,
    MdButtonModule
  ],
  declarations: [
    UploadButtonComponent
  ]
})
export class UploadButtonModule { }
