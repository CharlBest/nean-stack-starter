import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { UserModel } from '../../../../server/models/user/user.model';
import { ProfileService } from '../profile.service';
import { ShareUserDialogComponent } from '../share-user-dialog/share-user-dialog.component';
import { ReportUserDialogComponent } from '../report-user-dialog/report-user-dialog.component';
import { environment } from '../../../environments/environment';
import * as emojione from 'emojione';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserModel;
  isProcessing = true;

  constructor(private profileService: ProfileService,
    private router: Router,
    public dialog: MdDialog) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.profileService.getUser().subscribe(data => {
      this.user = data;
      this.isProcessing = false;

      if (this.user !== null && this.user.bio !== null && this.user.bio !== '') {
        this.loadEmoji();
      }
    }, error => {
      this.isProcessing = false;
      // this.serverErrors = this.formService.getServerErrors(error);
    });
  }

  goToEdit() { }

  loadEmoji() {
    (<any>emojione).ascii = true;
    const output = emojione.toImage(this.user.bio);
    this.user.bio = output;
  }

  openShareDialog() {
    const dialogRef = this.dialog.open(ShareUserDialogComponent);

    const link = ['/user', this.user.uId];
    dialogRef.componentInstance.link = environment.hostUrlForSharingToWeb + this.router.createUrlTree(link).toString();
  }

  openReportDialog() {
    const dialogRef = this.dialog.open(ReportUserDialogComponent);
    dialogRef.componentInstance.uId = this.user.uId;
  }
}
