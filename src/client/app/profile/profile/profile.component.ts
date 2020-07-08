import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UpdateAvatarViewModel } from '@shared/view-models/profile/update-avatar.view-model';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { FileUploaderComponent } from '../../shared/file-uploader/file-uploader/file-uploader.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { TutorialService } from '../../shared/tutorial/tutorial.service';
import { ProfileService } from '../profile.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('backNavRightPlaceholder', { static: true }) backNavRightPlaceholder: TemplateRef<ElementRef>;
  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  user: UserProfileViewModel;
  isProcessing = true;

  constructor(private profileService: ProfileService,
    private shareDialogService: ShareDialogService,
    private snackBar: MatSnackBar,
    private tutorialService: TutorialService,
    private firebaseStorageService: FirebaseStorageService,
    private formErrorsService: FormErrorsService,
    private router: Router,
    private shareService: ShareService,
    public bpService: BreakpointService,
    private changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getUser();
  }

  async getUser(): Promise<void> {
    try {
      const response = await this.profileService.getUserProfile();
      if (response) {
        // Default card first
        if (response.paymentCards) {
          response.paymentCards.sort((a, b) => (a.isDefault === b.isDefault) ? 0 : a.isDefault ? -1 : 1);
        }

        this.user = response;

        // This is necessary for file uploader to be rendered in the dom
        this.changeDetection.detectChanges();

        this.fileUploader.setImages(this.user.avatar);
      }
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    } finally {
      this.isProcessing = false;
    }
  }

  async updateAvatar(): Promise<void> {
    const files = await this.fileUploader.upload();

    const viewModel = new UpdateAvatarViewModel();
    // TODO: hack
    viewModel.avatar = files && files.length > 0 ? files[files.length - 1] : null;

    try {
      await this.profileService.updateAvatar(viewModel);

      if (this.user.avatar && (!viewModel.avatar || (this.user.avatar.url !== viewModel.avatar.url))) {
        await this.firebaseStorageService.delete(this.user.avatar.url);
      }

      this.user.avatar = viewModel.avatar;
      this.fileUploader.setImages(this.user.avatar);
    } catch (error) {
      this.formErrorsService.updateFormValidity(error);
    }
  }

  async resendEmailVerificationLink(): Promise<void> {
    this.contextMenu.close();

    this.snackBar.dismiss();
    this.snackBar.open('Sending...');

    try {
      await this.profileService.resendEmailVerificationLink();
      this.snackBar.dismiss();
      this.snackBar.open('Sent');
    } catch (error) {
      this.snackBar.dismiss();
      const sendingBar = this.snackBar.open('Sending failed', 'Resend', {
        duration: 5000
      });
      sendingBar.onAction().subscribe(() => this.resendEmailVerificationLink());
    }
  }

  goToDeleteAccount(): void {
    this.contextMenu.close();
    this.router.navigate(['/profile/delete'], { queryParams: { email: this.user.email }, queryParamsHandling: 'merge' });
  }

  profileTour(): void {
    this.contextMenu.close();
    this.tutorialService.activateTutorial(TutorialType.AVATAR_UPLOAD);
  }

  openShareDialog(): void {
    this.contextMenu.close();

    const url = ['/user', this.user.id];
    if (!this.shareService.webShareWithUrl('User', url)) {
      this.shareDialogService.share(this.user.username, url);
    }
  }

  copyLink(): void {
    this.shareService.copyWithUrl(['/user', this.user.id]);
    this.contextMenu.close();
  }
}
