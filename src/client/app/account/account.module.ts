import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatListModule } from '@angular/material';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';

const materialModules = [
  MatButtonModule,
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
