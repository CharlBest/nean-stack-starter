import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../../shared/validation/validators';
import { PaymentRequestViewModel } from '../../../../../shared/view-models/payment/payment-request.view-model';
import { FormErrorsService } from '../../form-errors/form-errors.service';
import { PaymentService } from '../payment.service';
import { StripePaymentComponent } from '../stripe-payment/stripe-payment.component';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

    @ViewChild('stripeElements') stripeElementsComponent: StripePaymentComponent;

    isProcessing = true;
    formGroup: FormGroup;
    paymentSuccess = false;

    constructor(private fb: FormBuilder,
        private paymentService: PaymentService,
        public formErrorsService: FormErrorsService) { }

    ngOnInit() {
        this.formOnInit();
    }

    formOnInit() {
        this.formGroup = this.fb.group(BuildFormGroup.payment());
    }

    async onSubmit() {
        this.isProcessing = true;
        const token = await this.stripeElementsComponent.generateToken();

        if (token) {
            this.sendPaymentToServer(token.id)
        }
    }

    sendPaymentToServer(token: string) {
        const viewModel = new PaymentRequestViewModel();
        viewModel.token = token;
        viewModel.amount = +this.formGroup.get('amount').value;

        this.paymentService.processPaymentRequest(viewModel)
            .pipe(finalize(() => this.isProcessing = false))
            .subscribe(() => {
                this.paymentSuccess = true;
            }, error => {
                this.formErrorsService.updateFormValidity(error, this.formGroup);
            });
    }
}
