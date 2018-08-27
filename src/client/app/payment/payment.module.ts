import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { StripeElementsModule } from '../shared/stripe-elements/stripe-elements.module';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment/payment.component';

const materialModules = [
    MatCardModule,
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
        PaymentRoutingModule,
        ReactiveFormsModule,
        FormErrorsModule,
        StripeElementsModule,
        ...materialModules,
    ],
    declarations: [
        PaymentComponent
    ],
    entryComponents: [
        PaymentComponent
    ]
})
export class PaymentModule { }
