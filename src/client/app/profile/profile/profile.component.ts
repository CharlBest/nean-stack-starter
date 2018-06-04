import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import * as emojione from 'emojione';
import { UserModel } from '../../../../shared/models/user/user.model';
import { UpdateAvatarViewModel } from '../../../../shared/view-models/profile/update-avatar.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { ReportDialogService } from '../../shared/report-dialog/report-dialog.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { TutorialService } from '../../shared/tutorial/tutorial.service';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserModel = null;
  isProcessing = true;
  tutorialTypeEnum = TutorialType;

  constructor(private profileService: ProfileService,
    private shareDialogService: ShareDialogService,
    private reportDialogService: ReportDialogService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private tutorialService: TutorialService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.profileService.getUser().subscribe(data => {
      this.user = data;
      this.isProcessing = false;

      if (this.user !== null && this.user.bio !== null && this.user.bio !== undefined && this.user.bio !== '') {
        this.loadEmoji();
      }
    }, error => {
      this.isProcessing = false;
      // this.serverErrors = this.formService.getServerErrors(error);
    });
  }

  loadEmoji() {
    (<any>emojione).ascii = true;
    const output = emojione.toImage(this.user.bio);
    this.user.bio = output;
  }

  openShareDialog() {
    const link = ['/user', this.user.uId];
    this.shareDialogService.share(link);
  }

  openReportDialog() {
    this.reportDialogService.report(this.user.uId);
  }

  updateAvatar(downloadURL: string) {
    const viewModel = new UpdateAvatarViewModel;
    viewModel.avatarUrl = downloadURL;

    this.profileService.updateAvatar(viewModel).subscribe(data => {
      this.user.avatarUrl = viewModel.avatarUrl;
    }, error => {
    });
  }

  removeAvatar() {
    this.updateAvatar('');
  }

  resendEmailVerificationLink() {
    this.snackBar.open('Sending...', '', {
      duration: 10000,
    });

    this.profileService.resendEmailVerificationLink().subscribe(data => {
      this.snackBar.dismiss();
      this.snackBar.open('Sent', '', {
        duration: 2000,
      });
    }, error => {
    });
  }

  openDeleteAccountDialog() {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent);
    dialogRef.componentInstance.username = this.user.username;
  }

  profileTour() {
    this.tutorialService.activateTutorial(TutorialType.ProfileShare);
  }
}
