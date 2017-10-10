import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReportUserViewModel } from '../../../../../server/view-models/profile/report-user.view-model';
import { ReportDialogService } from '../report-dialog.service';
import { environment } from '../../../../environments/environment';
import { UserRoutes } from '../../../../../server/routes/user.routes';

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {

    uId: string;

    constructor(public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private http: HttpClient) { }

    report() {
        this.dialog.closeAll();

        const viewModel = new ReportUserViewModel;
        viewModel.uId = this.uId;

        this.snackBar.open('Sending', '', {
            duration: 10000,
        });

        this.sendReport(viewModel).subscribe(data => {
            this.snackBar.dismiss();

            this.snackBar.open('Sent', '', {
                duration: 2000,
            });
        });
    }

    private sendReport(viewModel: ReportUserViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.report.constructRootUrl()}`, viewModel);
    }
}
