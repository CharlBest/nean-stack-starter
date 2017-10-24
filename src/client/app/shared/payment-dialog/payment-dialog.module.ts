import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentDialogService } from './payment-dialog.service';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { PaymentService } from './payment.service';
import {
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        ShowErrorsModule
    ],
    declarations: [
        PaymentDialogComponent
    ],
    providers: [
        PaymentDialogService,
        PaymentService
    ],
    entryComponents: [
        PaymentDialogComponent
    ]
})
export class PaymentDialogModule { }
