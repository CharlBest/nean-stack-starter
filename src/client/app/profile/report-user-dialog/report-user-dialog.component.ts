import { Component, OnInit, Input } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { ReportUserViewModel } from '../../../../server/view-models/profile/report-user.view-model';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-report-user-dialog',
  templateUrl: './report-user-dialog.component.html',
  styleUrls: ['./report-user-dialog.component.scss']
})
export class ReportUserDialogComponent implements OnInit {

  @Input() uId: string;

  constructor(public snackBar: MdSnackBar,
    public dialog: MdDialog,
    private profileService: ProfileService) { }

  ngOnInit() {
  }

  report() {
    this.dialog.closeAll();

    const viewModel = new ReportUserViewModel;
    viewModel.uId = this.uId;

    this.snackBar.open('Sending', '', {
      duration: 10000,
    });

    this.profileService.reportUser(viewModel).subscribe(data => {
      this.snackBar.dismiss();

      this.snackBar.open('Sent', '', {
        duration: 2000,
      });
    });
  }
}
