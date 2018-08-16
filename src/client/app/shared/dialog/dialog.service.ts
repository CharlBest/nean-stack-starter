import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) { }

    alert(message: string) {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            disableClose: true
        });
        dialogRef.componentInstance.message = message;
    }

    confirm(message: string): Observable<boolean> {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true
        });
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }
}
