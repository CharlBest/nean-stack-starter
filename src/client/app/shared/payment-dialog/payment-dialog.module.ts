import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { ShowErrorsModule } from '../show-errors/show-errors.module';
import { PaymentDialogService } from './payment-dialog.service';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { PaymentService } from './payment.service';

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
    providers: [
        PaymentDialogService,
        PaymentService
    ],
    entryComponents: [
        PaymentDialogComponent
    ]
})
export class PaymentDialogModule { }
