import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { IconsModule } from '../shared/icons/icons.module';
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
    ...materialModules
  ],
  declarations: [
    AccountComponent
  ]
})
export class AccountModule { }
