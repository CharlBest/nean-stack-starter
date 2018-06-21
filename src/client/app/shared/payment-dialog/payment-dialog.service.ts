import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class PaymentDialogService {

    constructor(private dialog: MatDialog) { }

    open() {
        const dialogRef = this.dialog.open(PaymentDialogComponent);

        return dialogRef.afterClosed();
    }
}
