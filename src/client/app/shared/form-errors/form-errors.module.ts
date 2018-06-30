import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormErrorsComponent } from './form-errors/form-errors.component';

const materialModules = [
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  declarations: [
    FormErrorsComponent
  ],
  exports: [
    FormErrorsComponent
  ]
})
export class FormErrorsModule { }
