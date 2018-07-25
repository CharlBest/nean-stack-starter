import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { StripeElementsModule } from '../stripe-elements/stripe-elements.module';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormErrorsModule,
        StripeElementsModule,
        ...materialModules
    ],
    declarations: [
        PaymentDialogComponent
    ],
    entryComponents: [
        PaymentDialogComponent
    ]
})
export class PaymentDialogModule { }
