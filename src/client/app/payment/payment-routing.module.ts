import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation/navigation-type.enum';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: PaymentComponent, pathMatch: 'full', data: { title: 'Payment', nav: NavigationType.Back } }
        ])
    ],
    exports: [RouterModule]
})
export class PaymentRoutingModule { }
