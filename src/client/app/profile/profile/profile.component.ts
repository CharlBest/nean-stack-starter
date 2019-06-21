import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ReportUserViewModel } from '../../../../shared/view-models/profile/report-user.view-model';
import { UpdateAvatarViewModel } from '../../../../shared/view-models/profile/update-avatar.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { UserProfileViewModel } from '../../../../shared/view-models/user/user-profile.view-model';
import { ContextMenuComponent } from '../../shared/context-menu/context-menu/context-menu.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { FirebaseStorageService } from '../../shared/services/firebase-storage.service';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { TutorialService } from '../../shared/tutorial/tutorial.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('backNavRightPlaceholder', { static: true }) backNavRightPlaceholder: TemplateRef<any>;
  @ViewChild('contextMenu', { static: false }) contextMenu: ContextMenuComponent;
  user: UserProfileViewModel;
  isProcessing = true;
  tutorialTypeEnum = TutorialType;

  constructor(private profileService: ProfileService,
    private shareDialogService: ShareDialogService,
    private snackBar: MatSnackBar,
    private tutorialService: TutorialService,
    private firebaseStorageService: FirebaseStorageService,
    private formErrorsService: FormErrorsService,
    private dialogService: DialogService,
    private router: Router,
    private navigationService: NavigationService,
    private shareService: ShareService) { }

  ngOnInit() {
    this.getUser();

    // Set template ref for back nav right placeholder
    this.navigationService.navigationPlaceholderTemplate = this.backNavRightPlaceholder;
  }

  getUser() {
    this.profileService.getUserProfile()
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        if (data) {
          // Default card first
          if (data.paymentCards) {
            data.paymentCards.sort((a, b) => <any>b.isDefault - <any>a.isDefault);
          }

          this.user = data;
        }
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  reportUser() {
    this.dialogService.confirm('This user is either spam, abusive, harmful or you think it doesn\'t belong on here.').subscribe(data => {
      if (data) {
        this.contextMenu.close();

        const viewModel = new ReportUserViewModel;
        viewModel.uId = this.user.uId;

        this.snackBar.open('Sending...');

        this.profileService.sendReport(viewModel)
          .subscribe(() => {
            this.snackBar.dismiss();
            this.snackBar.open('Sent');
          }, error => {
            this.snackBar.dismiss();
            this.snackBar.open('Sending failed');
          });
      }
    });
  }

  updateAvatar(downloadURL: string | null) {
    const viewModel = new UpdateAvatarViewModel;
    viewModel.avatarUrl = downloadURL;

    this.profileService.updateAvatar(viewModel)
      .subscribe(() => {
        this.user.avatarUrl = viewModel.avatarUrl;
      }, error => {
        this.formErrorsService.updateFormValidity(error);
      });
  }

  removeAvatar() {
    if (this.user.avatarUrl) {
      this.firebaseStorageService.delete(this.user.avatarUrl).subscribe(data => {
        if (data) {
          this.updateAvatar(null);
        }
      });
    }
  }

  resendEmailVerificationLink() {
    this.contextMenu.close();

    this.snackBar.dismiss();
    this.snackBar.open('Sending...');

    this.profileService.resendEmailVerificationLink()
      .subscribe(() => {
        this.snackBar.dismiss();
        this.snackBar.open('Sent');
      }, error => {
        this.snackBar.dismiss();
        const sendingBar = this.snackBar.open('Sending failed', 'Resend', {
          duration: 5000
        });
        sendingBar.onAction().subscribe(() => {
          this.resendEmailVerificationLink();
        });
      });
  }

  goToDeleteAccount() {
    this.contextMenu.close();
    this.router.navigate(['/profile/delete'], { queryParams: { email: this.user.email }, queryParamsHandling: 'merge' });
  }

  profileTour() {
    this.contextMenu.close();
    this.tutorialService.activateTutorial(TutorialType.AvatarUpload);
  }

  openShareDialog() {
    this.contextMenu.close();

    const url = ['/user', this.user.id];
    if (!this.shareService.webShareWithUrl('User', url)) {
      this.shareDialogService.share(url);
    }
  }

  copyLink() {
    this.shareService.copyWithUrl(['/user', this.user.id]);
    this.contextMenu.close();
  }
}
