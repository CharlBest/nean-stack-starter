import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';

@Injectable()
export class ReportDialogService {

    constructor(private dialog: MatDialog) { }

    report(uId: string) {
        const dialogRef = this.dialog.open(ReportDialogComponent);

        dialogRef.componentInstance.uId = uId;

        return dialogRef.afterClosed();
    }
}
