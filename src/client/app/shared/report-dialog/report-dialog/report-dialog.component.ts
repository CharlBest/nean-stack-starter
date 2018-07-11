import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../../../shared/routes/user.routes';
import { ReportUserViewModel } from '../../../../../shared/view-models/profile/report-user.view-model';
import { environment } from '../../../../environments/environment';

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

        this.snackBar.open('Sending', null, {
            duration: 10000,
        });

        this.sendReport(viewModel)
            .subscribe(() => {
                this.snackBar.dismiss();

                this.snackBar.open('Sent', null, {
                    duration: 2000,
                });
            });
    }

    private sendReport(viewModel: ReportUserViewModel): Observable<void> {
        return this.http.post<void>(`${environment.apiUrlEndpoint}${UserRoutes.report.constructRootUrl()}`, viewModel);
    }
}
