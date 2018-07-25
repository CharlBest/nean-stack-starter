import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material';
import { StripeElementsComponent } from './stripe-elements/stripe-elements.component';

const materialModules = [
    MatInputModule
];

@NgModule({
    imports: [
        CommonModule,
        ...materialModules
    ],
    declarations: [
        StripeElementsComponent
    ],
    exports: [
        StripeElementsComponent
    ]
})
export class StripeElementsModule { }
