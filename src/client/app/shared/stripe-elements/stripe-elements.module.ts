import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CardBrandComponent } from './card-brand/card-brand.component';
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
        StripeElementsComponent,
        CardBrandComponent,
    ],
    exports: [
        StripeElementsComponent,
        CardBrandComponent,
    ]
})
export class StripeElementsModule { }
