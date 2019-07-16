import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsModule } from '../icons/icons.module';
import { HTMLEditorComponent } from './html-editor/html-editor.component';

const materialModules = [
  MatButtonModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatSnackBarModule
];

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
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
