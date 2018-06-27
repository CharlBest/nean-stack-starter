import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import * as emojione from 'emojione';
import { finalize } from 'rxjs/operators';
import { UserModel } from '../../../../shared/models/user/user.model';
import { UpdateAvatarViewModel } from '../../../../shared/view-models/profile/update-avatar.view-model';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { FirebaseStorageService } from '../../shared/firebase-storage.service';
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
    private tutorialService: TutorialService,
    private firebaseStorageService: FirebaseStorageService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.profileService.getUser()
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.user = data;

        if (this.user !== null && this.user.bio !== null && this.user.bio !== undefined && this.user.bio !== '') {
          this.loadEmoji();
        }
      }, error => {
        // TODO: apply error handeling
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

    // TODO: apply preloader
    this.profileService.updateAvatar(viewModel)
      .subscribe(() => {
        this.user.avatarUrl = viewModel.avatarUrl;
      }, error => {
        // TODO: apply error handeling
      });
  }

  removeAvatar() {
    // https://firebasestorage.googleapis.com/v0/b/nean-dev.appspot.com/o/images%2Fimages-aa9e8379-11b0-4b41-80ca-20f99f0ba300.jpg?alt=media&token=189f1d63-93ed-4195-bb34-774f118032cd
    // const fileName = this.user.avatarUrl.indexOf()
    // this.firebaseStorageService.delete().subscribe(data => {
    //   if (data) {
    //     this.updateAvatar('');
    //   }
    // })
  }

  resendEmailVerificationLink() {
    this.snackBar.open('Sending...', '', {
      duration: 10000,
    });

    this.profileService.resendEmailVerificationLink()
      .subscribe(() => {
        this.snackBar.dismiss();
        this.snackBar.open('Sent', '', {
          duration: 2000,
        });
      }, error => {
        // TODO: error handeling
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
