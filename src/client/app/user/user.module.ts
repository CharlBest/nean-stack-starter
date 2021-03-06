import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ItemModule } from '../item/item.module';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { FilterModule } from '../shared/filter/filter.module';
import { IconsModule } from '../shared/icons/icons.module';
import { InfiniteScrollModule } from '../shared/infinite-scroll/infinite-scroll.module';
import { MediaModule } from '../shared/media/media.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { RightClickContextMenuModule } from '../shared/right-click-context-menu/right-click-context-menu.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatListModule,
];

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ItemModule,
    ShareDialogModule,
    ContextMenuModule,
    IconsModule,
    InfiniteScrollModule,
    MediaModule,
    RightClickContextMenuModule,
    PreloaderModule,
    FilterModule,
    ...materialModules
  ],
  declarations: [
    UserComponent
  ]
})
export class UserModule { }
