import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { IconsModule } from '../shared/icons/icons.module';
import { TranslateModule } from '../shared/translate/translate.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';

const materialModules = [
  MatCardModule,
  MatListModule,
];

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    IconsModule,
    TranslateModule,
    ...materialModules
  ],
  declarations: [
    AccountComponent
  ]
})
export class AccountModule { }
