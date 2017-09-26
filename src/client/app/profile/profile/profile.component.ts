import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { UserModel } from '../../../../server/models/user/user.model';
import { ProfileService } from '../profile.service';
import { environment } from '../../../environments/environment';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';
import { ReportDialogService } from '../../shared/report-dialog/report-dialog.service';
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
    private shareDialogService: ShareDialogService,
    private reportDialogService: ReportDialogService) { }

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
    const link = ['/user', this.user.uId];
    this.shareDialogService.share(link);
  }

  openReportDialog() {
    this.reportDialogService.report(this.user.uId);
  }
}
