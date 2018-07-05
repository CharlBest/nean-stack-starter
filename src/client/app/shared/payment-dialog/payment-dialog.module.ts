import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormErrorsModule,
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
