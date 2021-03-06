import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { UploadButtonModule } from '../shared/file-uploader/file-uploader.module';
import { FilterModule } from '../shared/filter/filter.module';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { IconsModule } from '../shared/icons/icons.module';
import { InfiniteScrollModule } from '../shared/infinite-scroll/infinite-scroll.module';
import { MediaModule } from '../shared/media/media.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { RightClickContextMenuModule } from '../shared/right-click-context-menu/right-click-context-menu.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentComponent } from './comment/comment.component';
import { CommentsComponent } from './comments/comments.component';
import { CreateCommentComponent } from './create-comment/create-comment.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemRoutingModule } from './item-routing.module';
import { FormatRelativeTimePipe } from './item/format-relative-time.pipe';
import { ItemComponent } from './item/item.component';
import { RepliesComponent } from './replies/replies.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatMenuModule,
  MatListModule,
  MatTooltipModule,
  DragDropModule,
  MatChipsModule
];

@NgModule({
  imports: [
    CommonModule,
    ItemRoutingModule,
    MediaModule,
    UploadButtonModule,
    ShareDialogModule,
    ReactiveFormsModule,
    FormErrorsModule,
    ContextMenuModule,
    IconsModule,
    InfiniteScrollModule,
    RightClickContextMenuModule,
    PreloaderModule,
    FilterModule,
    ...materialModules
  ],
  declarations: [
    ItemComponent,
    CommentsComponent,
    ItemFormComponent,
    CreateItemComponent,
    EditItemComponent,
    FavouritesComponent,
    SubscriptionsComponent,
    CommentComponent,
    RepliesComponent,
    CommentFormComponent,
    CreateCommentComponent,
    FormatRelativeTimePipe
  ],
  exports: [
    ItemComponent
  ]
})
export class ItemModule { }
