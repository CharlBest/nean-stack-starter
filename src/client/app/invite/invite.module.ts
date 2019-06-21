import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
