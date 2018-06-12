import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule } from '@angular/material';
import { HTMLEditorComponent } from './html-editor/html-editor.component';

const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatProgressBarModule
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  declarations: [
    HTMLEditorComponent
  ],
  exports: [
    HTMLEditorComponent
  ]
})
export class HTMLEditorModule { }
