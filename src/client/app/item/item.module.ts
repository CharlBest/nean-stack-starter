import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { IconsModule } from '../shared/icons/icons.module';
import { InfiniteScrollModule } from '../shared/infinite-scroll/infinite-scroll.module';
import { MediaModule } from '../shared/media/media.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { UploadButtonModule } from '../shared/upload-button/upload-button.module';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentComponent } from './comment/comment.component';
import { CommentsComponent } from './comments/comments.component';
import { CreateCommentComponent } from './create-comment/create-comment.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditCommentComponent } from './edit-comment/edit-comment.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './item/item.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatListModule,
  MatTooltipModule,
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
    ...materialModules
  ],
  declarations: [
    ItemComponent,
    CommentsComponent,
    ItemFormComponent,
    CreateItemComponent,
    EditItemComponent,
    FavouritesComponent,
    CommentComponent,
    CommentFormComponent,
    EditCommentComponent,
    CreateCommentComponent,
  ],
  exports: [
    ItemComponent
  ]
})
export class ItemModule { }
