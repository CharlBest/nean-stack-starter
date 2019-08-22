import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { LanguageRoutingModule } from './language-routing.module';
import { LanguageComponent } from './language/language.component';

const materialModules = [
  MatCardModule,
  MatRadioModule,
];

@NgModule({
  imports: [
    CommonModule,
    LanguageRoutingModule,
    ...materialModules
  ],
  declarations: [
    LanguageComponent
  ]
})
export class LanguageModule { }
