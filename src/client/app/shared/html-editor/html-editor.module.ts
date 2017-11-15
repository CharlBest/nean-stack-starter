import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTMLEditorComponent } from './html-editor/html-editor.component';
import {
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  declarations: [
    HTMLEditorComponent
  ],
  exports: [
    HTMLEditorComponent
  ]
})
export class HTMLEditorModule { }
