import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { IconsModule } from '../shared/icons/icons.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent } from './invite/invite.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatChipsModule,
];

@NgModule({
  imports: [
    CommonModule,
    InviteRoutingModule,
    IconsModule,
    PreloaderModule,
    ...materialModules
  ],
  declarations: [
    InviteComponent
  ]
})
export class InviteModule { }
