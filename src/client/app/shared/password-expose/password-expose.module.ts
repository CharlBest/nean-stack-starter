import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PasswordExposeDirective } from './password-expose.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PasswordExposeDirective
  ],
  exports: [
    PasswordExposeDirective
  ]
})
export class PasswordExposeModule { }
