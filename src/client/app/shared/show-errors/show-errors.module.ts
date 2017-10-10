import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { MatIconModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [
    ShowErrorsComponent
  ],
  exports: [
    ShowErrorsComponent
  ]
})
export class ShowErrorsModule { }
