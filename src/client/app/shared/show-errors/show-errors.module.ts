import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { MdIconModule, MdButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    MdButtonModule
  ],
  declarations: [
    ShowErrorsComponent
  ],
  exports: [
    ShowErrorsComponent
  ]
})
export class ShowErrorsModule { }
