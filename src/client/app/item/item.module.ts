import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { MediaModule } from '../shared/media/media.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { UploadButtonModule } from '../shared/upload-button/upload-button.module';
import { CommentsComponent } from './comments/comments.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
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
  MatIconModule,
  MatBottomSheetModule,
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
    ...materialModules
  ],
  declarations: [
    ItemComponent,
    CommentsComponent,
    ItemFormComponent,
    CreateItemComponent,
    EditItemComponent,
  ],
  exports: [
    ItemComponent
  ]
})
export class ItemModule { }
