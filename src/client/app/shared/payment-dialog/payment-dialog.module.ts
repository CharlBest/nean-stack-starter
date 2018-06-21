import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
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
