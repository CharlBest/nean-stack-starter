import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { ShowErrorsComponent } from './show-errors/show-errors.component';

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
