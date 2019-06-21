import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
