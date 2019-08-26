import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormErrorsComponent } from './form-errors/form-errors.component';
import { PasswordCharacterMessageBuilderPipe } from './form-errors/password-character-message-builder.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FormErrorsComponent,
    PasswordCharacterMessageBuilderPipe
  ],
  exports: [
    FormErrorsComponent
  ]
})
export class FormErrorsModule { }
