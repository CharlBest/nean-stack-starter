import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';
import { ItemModule } from '../item/item.module';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatIconModule,
];

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ItemModule,
    ShareDialogModule,
    ContextMenuModule,
    ...materialModules
  ],
  declarations: [
    UserComponent
  ]
})
export class UserModule { }
