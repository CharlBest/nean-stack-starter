import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormErrorsComponent } from './form-errors/form-errors.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormErrorsComponent
  ],
  exports: [
    FormErrorsComponent
  ]
})
export class FormErrorsModule { }
