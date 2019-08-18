import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateDirective } from './translate.directive';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TranslateDirective,
    TranslatePipe
  ],
  exports: [
    TranslateDirective,
    TranslatePipe
  ]
})
export class TranslateModule { }
