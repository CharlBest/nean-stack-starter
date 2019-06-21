import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
