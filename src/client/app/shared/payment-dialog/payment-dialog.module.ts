import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

const materialModules = [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ShowErrorsModule,
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
