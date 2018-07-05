import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { EmojiPanelModule } from '../shared/emoji-panel/emoji-panel.module';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { HTMLEditorModule } from '../shared/html-editor/html-editor.module';
import { MediaModule } from '../shared/media/media.module';
import { ReportDialogModule } from '../shared/report-dialog/report-dialog.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { UploadButtonModule } from '../shared/upload-button/upload-button.module';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { UpdateBioComponent } from './update-bio/update-bio.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatIconModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatInputModule,
];

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    ShareDialogModule,
    ReportDialogModule,
    UploadButtonModule,
    FormErrorsModule,
    TutorialModule,
    EmojiPanelModule,
    MediaModule,
    HTMLEditorModule,
    ...materialModules
  ],
  declarations: [
    ProfileComponent,
    UpdateBioComponent,
    UpdatePasswordComponent,
    DeleteUserDialogComponent
  ],
  entryComponents: [
    DeleteUserDialogComponent
  ]
})
export class ProfileModule { }
