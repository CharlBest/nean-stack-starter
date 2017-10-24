import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class PaymentDialogService {

    constructor(private dialog: MatDialog) { }

    open() {
        const dialogRef = this.dialog.open(PaymentDialogComponent);

        return dialogRef.afterClosed();
    }
}
