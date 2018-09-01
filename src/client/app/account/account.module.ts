import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatIconModule, MatListModule } from '@angular/material';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';

const materialModules = [
  MatCardModule,
  MatListModule,
  MatIconModule,
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
