import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CardModel } from '../../../../shared/models/payment/card.model';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { AnonymousPaymentViewModel } from '../../../../shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '../../../../shared/view-models/payment/user-payment.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { StripeElementsComponent } from '../../shared/stripe-elements/stripe-elements/stripe-elements.component';
import { PaymentService } from '../payment.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
    @ViewChild('stripeElements', { static: true }) stripeElementsComponent: StripeElementsComponent;

    isAuthenticated: boolean = this.authService.hasToken();
    isProcessing = true;
    isProcessingStripeElements = true;
    formGroup: FormGroup;
    paymentSuccess = false;
    paymentCards: CardModel[];

    constructor(private fb: FormBuilder,
        private paymentService: PaymentService,
        public formErrorsService: FormErrorsService,
        private authService: AuthService,
        public dialogService: DialogService) { }

    ngOnInit() {
        this.formOnInit();
        this.getpaymentCards();
    }

    formOnInit() {
        this.formGroup = this.fb.group(BuildFormGroup.payment());
    }

    getpaymentCards() {
        if (this.isAuthenticated) {
            this.authService.preventLogoutOnNextRequest();
            this.paymentService.paymentCards()
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(data => {
                    if (data) {
                        this.paymentCards = data;
                        // Default card first
                        if (this.paymentCards) {
                            this.paymentCards.sort((a, b) => <any>b.isDefault - <any>a.isDefault);
                        }

                        const firstCardUId = this.paymentCards && this.paymentCards.length > 0 ? this.paymentCards[0].uId : null;
                        this.formGroup.controls['cardUId'].setValue(firstCardUId);
                    }
                });
        } else {
            this.isProcessing = false;
        }
    }

    async onSubmit() {
        this.isProcessing = true;

        if (this.formGroup.controls['cardUId'].value === null || this.formGroup.controls['cardUId'].value === 'new') {
            const token = await this.stripeElementsComponent.generateToken();
            if (token) {
                this.sendPaymentToServer(token.id);
            } else {
                this.dialogService.alert('Invalid card details');
                this.isProcessing = false;
            }
        } else {
            this.sendPaymentToServer();
        }
    }

    sendPaymentToServer(token: string | null = null) {
        if (this.isAuthenticated) {
            const viewModel = new UserPaymentViewModel();
            viewModel.token = token;
            viewModel.cardUId = this.formGroup.controls['cardUId'].value;
            viewModel.amount = +this.formGroup.controls['amount'].value;
            viewModel.saveCard = this.formGroup.controls['saveCard'].value === true;

            this.paymentService.userPayment(viewModel)
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(() => {
                    this.paymentSuccess = true;
                }, error => {
                    this.formErrorsService.updateFormValidity(error, this.formGroup);
                });
        } else {
            if (token) {
                const viewModel = new AnonymousPaymentViewModel();
                viewModel.token = token;
                viewModel.email = this.formGroup.controls['email'].value;
                viewModel.amount = +this.formGroup.controls['amount'].value;

                this.paymentService.anonymousPayment(viewModel)
                    .pipe(finalize(() => this.isProcessing = false))
                    .subscribe(() => {
                        this.paymentSuccess = true;
                    }, error => {
                        this.formErrorsService.updateFormValidity(error, this.formGroup);
                    });
            }
        }
    }

    isFormValid(): boolean {
        // Form validity (Amount is required)
        if (!this.formGroup.valid) {
            return false;
        }

        // Email is requried if anonymous payment
        if (!this.isAuthenticated && (this.formGroup.controls['email'].value === null || this.formGroup.controls['email'].value === '')) {
            return false;
        }

        // Stripe element valid when adding new card by user
        if (this.isAuthenticated && !this.stripeElementsComponent.isValid &&
            (this.formGroup.controls['cardUId'].value === null || this.formGroup.controls['cardUId'].value === 'new')) {
            return false;
        }

        return true;
    }
}
