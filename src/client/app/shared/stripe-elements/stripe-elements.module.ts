import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CardBrandComponent } from './card-brand/card-brand.component';
import { StripeElementsComponent } from './stripe-elements/stripe-elements.component';
import { StripePaymentRequestButtonComponent } from './stripe-payment-request-button/stripe-payment-request-button.component';

const materialModules = [
    MatInputModule
];

@NgModule({
    imports: [
        CommonModule,
        ...materialModules
    ],
    declarations: [
        StripeElementsComponent,
        StripePaymentRequestButtonComponent,
        CardBrandComponent,
    ],
    exports: [
        StripeElementsComponent,
        StripePaymentRequestButtonComponent,
        CardBrandComponent,
    ]
})
export class StripeElementsModule { }
