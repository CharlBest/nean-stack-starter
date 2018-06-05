import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Validators } from '../../../../../shared/validation/validators';
import { PaymentRequestViewModel } from '../../../../../shared/view-models/payment/payment-request.view-model';
import { environment } from '../../../../environments/environment';
import { FormService } from '../../form.service';
import { PaymentService } from '../payment.service';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

    isProcessing = false;
    form: FormGroup;
    serverErrors;

    stripe = null;
    stripeCard = null;
    paymentSuccess = false;

    constructor(public snackBar: MatSnackBar,
        private fb: FormBuilder,
        private paymentService: PaymentService,
        private formService: FormService,
        public dialogRef: MatDialogRef<PaymentDialogComponent>) { }

    ngOnInit() {
        this.buildStripe();
        this.formOnInit();
    }

    buildStripe() {
        // Create a Stripe client
        if (window['Stripe']) {
            this.stripe = window['Stripe'](environment.stripe.publishableKey);

            // Create an instance of Elements
            const elements = this.stripe.elements();

            // Custom styling can be passed to options when creating an Element.
            // (Note that this demo uses a wider set of styles than the guide below.)
            const style = {
                base: {
                    color: '#32325d',
                    lineHeight: '24px',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            };

            // Create an instance of the card Element
            this.stripeCard = elements.create('card', { style: style });

            // Add an instance of the card Element into the `card-element` <div>
            this.stripeCard.mount('#card-element');

            // Handle real-time validation errors from the card Element.
            this.stripeCard.addEventListener('change', function (event) {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }
    }

    formOnInit() {
        this.form = this.fb.group({
            amount: ['', [
                Validators.required
            ]]
        });
    }

    onSubmit() {
        this.isProcessing = true;

        this.stripe.createToken(this.stripeCard).then((result) => {
            if (result.error) {
                // Inform the user if there was an error
                const errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the token to your server
                this.sendPaymentToServer(result.token.id);
            }
        });
    }

    sendPaymentToServer(token: string) {
        const viewModel = new PaymentRequestViewModel();
        viewModel.token = token;
        viewModel.amount = +this.form.get('amount').value;

        this.paymentService.processPaymentRequest(viewModel).subscribe(
            data => {
                this.isProcessing = false;
                this.paymentSuccess = true;
            }, error => {
                this.isProcessing = false;
                this.serverErrors = this.formService.getServerErrors(error);
            });
    }

    openSnackBar() {
        this.snackBar.open('Copied', '', {
            duration: 2000,
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
