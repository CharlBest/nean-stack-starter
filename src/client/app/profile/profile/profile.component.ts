import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReportUserViewModel } from '@shared/view-models/profile/report-user.view-model';
import { UpdateAvatarViewModel } from '@shared/view-models/profile/update-avatar.view-model';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FileUploaderComponent } from '../../shared/file-uploader/file-uploader/file-uploader.component';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
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
  @ViewChild('contextMenu', { static: false }) contextMenu: ContextMenuComponent;
  @ViewChild('fileUploader', { static: false }) fileUploader: FileUploaderComponent;
  user: UserProfileViewModel;
  isProcessing = true;

  constructor(private profileService: ProfileService,
    private shareDialogService: ShareDialogService,
    private snackBar: MatSnackBar,
    private tutorialService: TutorialService,
    private firebaseStorageService: FirebaseStorageService,
    private formErrorsService: FormErrorsService,
    private dialogService: DialogService,
    private router: Router,
    private navigationService: NavigationService,
    private shareService: ShareService,
    public bpService: BreakpointService,
    private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUser();

    // Set template ref for back nav right placeholder
    this.navigationService.navigationPlaceholderTemplate = this.backNavRightPlaceholder;
  }

  async getUser() {
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

  async reportUser() {
    const hasConfirmed = await this.dialogService
      .confirm('This user is either spam, abusive, harmful or you think it doesn\'t belong on here.');
    if (hasConfirmed) {
      this.contextMenu.close();

      const viewModel = new ReportUserViewModel();
      viewModel.uId = this.user.uId;

      this.snackBar.open('Sending...');

      try {
        await this.profileService.sendReport(viewModel);
        this.snackBar.dismiss();
        this.snackBar.open('Sent');
      } catch (error) {
        this.snackBar.dismiss();
        this.snackBar.open('Sending failed');
      }
    }
  }

  async updateAvatar() {
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

  async resendEmailVerificationLink() {
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

  goToDeleteAccount() {
    this.contextMenu.close();
    this.router.navigate(['/profile/delete'], { queryParams: { email: this.user.email }, queryParamsHandling: 'merge' });
  }

  profileTour() {
    this.contextMenu.close();
    this.tutorialService.activateTutorial(TutorialType.AVATAR_UPLOAD);
  }

  openShareDialog() {
    this.contextMenu.close();

    const url = ['/user', this.user.id];
    if (!this.shareService.webShareWithUrl('User', url)) {
      this.shareDialogService.share(url, this.user.username);
    }
  }

  copyLink() {
    this.shareService.copyWithUrl(['/user', this.user.id]);
    this.contextMenu.close();
  }
}
