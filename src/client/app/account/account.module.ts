import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    ...materialModules
  ],
  declarations: [
    AccountComponent
  ]
})
export class AccountModule { }
