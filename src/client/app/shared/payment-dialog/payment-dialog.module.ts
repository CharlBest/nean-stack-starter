import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatCheckboxModule
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormErrorsModule,
        ...materialModules
    ],
    declarations: [
        PaymentDialogComponent,
        StripePaymentComponent
    ],
    entryComponents: [
        PaymentDialogComponent
    ]
})
export class PaymentDialogModule { }
