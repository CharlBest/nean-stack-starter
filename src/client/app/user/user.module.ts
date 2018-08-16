import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ...materialModules
  ],
  declarations: [
    UserComponent
  ]
})
export class UserModule { }
