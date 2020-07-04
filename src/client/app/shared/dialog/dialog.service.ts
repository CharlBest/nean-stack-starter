import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog) { }

    alert({ title = 'Alert', body, closeButtonText = 'Close' }: { title?: string, body?: string, closeButtonText?: string })
        : Promise<void> {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            disableClose: true
        });
        if (title) {
            dialogRef.componentInstance.title = title;
        }
        if (body) {
            dialogRef.componentInstance.body = body;
        }
        if (closeButtonText) {
            dialogRef.componentInstance.closeButtonText = closeButtonText;
        }

        return dialogRef.afterClosed().toPromise();
    }

    confirm({ title = 'Confirmation', body, confirmButtonText = 'Confirm', closeButtonText = 'Cancel' }:
        { title?: string, body?: string, confirmButtonText?: string, closeButtonText?: string }): Promise<boolean> {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true
        });
        if (title) {
            dialogRef.componentInstance.title = title;
        }
        if (body) {
            dialogRef.componentInstance.body = body;
        }
        if (confirmButtonText) {
            dialogRef.componentInstance.confirmButtonText = confirmButtonText;
        }
        if (closeButtonText) {
            dialogRef.componentInstance.closeButtonText = closeButtonText;
        }

        return dialogRef.afterClosed().toPromise();
    }
}
