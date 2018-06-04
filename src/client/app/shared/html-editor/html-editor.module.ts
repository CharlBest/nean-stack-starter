import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule } from '@angular/material';
import { HTMLEditorComponent } from './html-editor/html-editor.component';

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
