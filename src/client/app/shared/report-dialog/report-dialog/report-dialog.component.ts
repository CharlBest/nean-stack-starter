import { Component } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ReportUserViewModel } from '../../../../../shared/view-models/profile/report-user.view-model';
import { ReportService } from '../report.service';

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {

    uId: string;

    constructor(public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private reportService: ReportService) { }

    report() {
        this.dialog.closeAll();

        const viewModel = new ReportUserViewModel;
        viewModel.uId = this.uId;

        this.snackBar.open('Sending...', null, {
            duration: 10000,
        });

        this.reportService.sendReport(viewModel)
            .subscribe(() => {
                this.snackBar.dismiss();
                this.snackBar.open('Sent', null, {
                    duration: 2000,
                });
            }, error => {
                this.snackBar.dismiss();
                this.snackBar.open('Sending failed', null, {
                    duration: 2000,
                });
            });
    }
}
