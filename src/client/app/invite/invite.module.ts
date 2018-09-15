import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent } from './invite/invite.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatIconModule,
];

@NgModule({
  imports: [
    CommonModule,
    InviteRoutingModule,
    ...materialModules
  ],
  declarations: [
    InviteComponent
  ]
})
export class InviteModule { }
