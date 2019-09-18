import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';
import { EmojiPanelModule } from '../shared/emoji-panel/emoji-panel.module';
import { UploadButtonModule } from '../shared/file-uploader/file-uploader.module';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { HTMLEditorModule } from '../shared/html-editor/html-editor.module';
import { IconsModule } from '../shared/icons/icons.module';
import { MediaModule } from '../shared/media/media.module';
import { PasswordExposeModule } from '../shared/password-expose/password-expose.module';
import { PreloaderModule } from '../shared/preloader/preloader.module';
import { RightClickContextMenuModule } from '../shared/right-click-context-menu/right-click-context-menu.module';
import { ShareDialogModule } from '../shared/share-dialog/share-dialog.module';
import { StripeElementsModule } from '../shared/stripe-elements/stripe-elements.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { CreateCardComponent } from './create-card/create-card.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { FingerprintComponent } from './fingerprint/fingerprint.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentsComponent } from './payments/payments.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';
import { UpdateBioComponent } from './update-bio/update-bio.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatInputModule,
  MatListModule,
  MatChipsModule,
  MatRadioModule,
  MatTableModule,
  MatSlideToggleModule,
  MatCheckboxModule,
];

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ShareDialogModule,
    UploadButtonModule,
    FormErrorsModule,
    TutorialModule,
    EmojiPanelModule,
    MediaModule,
    HTMLEditorModule,
    StripeElementsModule,
    ContextMenuModule,
    IconsModule,
    RightClickContextMenuModule,
    PreloaderModule,
    PasswordExposeModule,
    ...materialModules
  ],
  declarations: [
    ProfileComponent,
    UpdateBioComponent,
    UpdatePasswordComponent,
    DeleteUserComponent,
    PaymentsComponent,
    PaymentHistoryComponent,
    CreateCardComponent,
    NotificationsComponent,
    TwoFactorAuthenticationComponent,
    FingerprintComponent,
  ]
})
export class ProfileModule { }
