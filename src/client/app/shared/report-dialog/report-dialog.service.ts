import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReportUserViewModel } from '../../../../server/view-models/profile/report-user.view-model';
import { Observable } from 'rxjs/Observable';
import { UserRoutes } from '../../../../server/routes/user.routes';

@Injectable()
export class ReportDialogService {

    constructor(private dialog: MdDialog) { }

    report(uId: string) {
        const dialogRef = this.dialog.open(ReportDialogComponent, {
            // width: '300px',
        });

        dialogRef.componentInstance.uId = uId;

        return dialogRef.afterClosed();
    }
}
