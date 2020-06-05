import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { CardViewModel } from '@shared/view-models/payment/card.view-model';
import { CreatePaymentIntentViewModel } from '@shared/view-models/payment/create-payment-intent.view-model';
import { PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { StripeElementsComponent } from '../../shared/stripe-elements/stripe-elements/stripe-elements.component';
import { StripePaymentRequestButtonComponent } from '../../shared/stripe-elements/stripe-payment-request-button/stripe-payment-request-button.component';
import { PaymentService } from '../payment.service';

/*
Stripe Testing Card:
Card number: 4242 4242 4242 4242
Expire date: Any future date
CVC: Any 3 degit number
Zip: Any 5 degit number
*/

/*
    User journeys:
    1) Not authenticated: all Stripe details required, email address required
    2) Authenticated: no cards, all Stripe details required
    3) Authenticated: has cards, create new one, all Stripe details required
    4) Authenticated: has cards, use existing one, card id required
*/

export enum Section {
    CARD = 1,
    MOBILE = 2,
    PAYPAL = 3
}

@Component({
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
    @ViewChild('stripePaymentRequestButton', { static: true }) stripePaymentRequestButton: StripePaymentRequestButtonComponent;
    @ViewChild('stripeElements', { static: true }) stripeElementsComponent: StripeElementsComponent;

    isAuthenticated: boolean = this.authService.hasToken();
    isProcessing = true;
    isProcessingStripeElements = true;
    formGroup: FormGroup;
    isFormValid = false;
    paymentSuccess = false;
    paymentCards: CardViewModel[];
    sections = Section;
    activeSection: Section;

    constructor(private fb: FormBuilder,
        private paymentService: PaymentService,
        public formErrorsService: FormErrorsService,
        private authService: AuthService,
        public dialogService: DialogService) { }

    ngOnInit() {
        this.formOnInit();
        this.checkAuthenticationAndGetCards();

        this.stripeElementsComponent.inputElementChange.subscribe(() => this.checkForValidity());
    }

    formOnInit() {
        this.formGroup = this.fb.group(FormGroupBuilder.payment(2, 'new'));
        this.formGroup.valueChanges.subscribe(() => this.checkForValidity());
    }

    checkAuthenticationAndGetCards() {
        if (this.isAuthenticated) {
            this.authService.preventLogoutOnNextRequest();
            this.getPaymentCards()
                .catch(error => {
                    // TODO: error handling
                })
                .finally(() => this.isProcessing = false);
        } else {
            this.isProcessing = false;
        }
    }

    async getPaymentCards() {
        const response = await this.paymentService.paymentCards();
        if (response) {
            this.paymentCards = response;
            // Default card first
            if (this.paymentCards) {
                this.paymentCards.sort((a, b) => (a.isDefault === b.isDefault) ? 0 : a.isDefault ? -1 : 1);
            }

            const firstCardId = this.paymentCards && this.paymentCards.length > 0 ? this.paymentCards[0].id : 'new';
            this.formGroup.controls.cardId.setValue(firstCardId);
        }
    }

    async onSubmit() {
        this.isProcessing = true;

        if (this.activeSection === Section.CARD) {
            this.paymentIntent();
        } else if (this.activeSection === Section.MOBILE) {
            this.stripePaymentRequestButton.activatePaymentRequestButton();
        }
    }

    async paymentIntent(): Promise<void> {
        const cardId = this.formGroup.controls.cardId.value;
        const viewModel: CreatePaymentIntentViewModel = {
            amount: +this.formGroup.controls.amount.value,
            currency: 'eur',
            email: this.formGroup.controls.email.value,
            cardId: cardId && cardId !== 'new' ? cardId : null,
            saveCard: this.formGroup.controls.saveCard.value,
        };

        try {
            const response = await this.paymentService.paymentIntent(viewModel);

            // Existing payment method
            if (response.clientSecret && viewModel.cardId) {
                this.paymentSuccess = true;
                return;
            }

            // New payment method
            if (response.clientSecret) {
                const paymentIntent = await this.stripeElementsComponent.confirmCardPayment(response.clientSecret);
                if (paymentIntent) {
                    this.paymentSuccess = true;
                    return;
                }
            }

            this.paymentSuccess = false;
        } catch (error) {
            this.formErrorsService.updateFormValidity(error, this.formGroup);
        } finally {
            this.isProcessing = false;
        }
    }

    // TODO: this is bad practice. This method will be called to many unnecessary times. Fix!
    checkForValidity() {
        // Form validity (Amount is required)
        if (!this.formGroup.valid) {
            this.isFormValid = false;
            return;
        }

        // Card payment
        if (this.activeSection === Section.CARD) {
            // Not authenticated AND stripe elements is valid and email is required
            if (!this.isAuthenticated && (!this.stripeElementsComponent.isValid ||
                this.formGroup.controls.email.value === null || this.formGroup.controls.email.value === '')) {
                this.isFormValid = false;
                return;
            }

            // Authenticated AND new card and stipe elements is valid
            if (this.isAuthenticated
                && this.formGroup.controls.cardId.value === 'new'
                && !this.stripeElementsComponent.isValid) {
                this.isFormValid = false;
                return;
            }
        } else if (this.activeSection === Section.MOBILE) {
            // Mobile payment
            this.isFormValid = !!this.stripePaymentRequestButton.canMakePayment;
            return;
        }

        this.isFormValid = true;
    }

    async paymentRequestButtonComplete(event: PaymentRequestPaymentMethodEvent) {
        // First, confirm the PaymentIntent without handling potential
        // next actions to see if there are any payment errors.
        const viewModel = await this.paymentService.paymentIntent({
            amount: +this.formGroup.controls.amount.value,
            currency: 'eur',
            email: event.payerEmail && !this.isAuthenticated ? event.payerEmail : undefined,
        });

        if (viewModel.clientSecret) {
            const confirmPaymentRequest =
                await this.stripePaymentRequestButton.confirmPaymentRequestButton(viewModel.clientSecret, event.paymentMethod.id);

            if (!confirmPaymentRequest) {
                // Complete with 'fail' and show error:
                event.complete('fail');
            } else {
                // Otherwise, close the Payment Request modal and call confirmCardPayment again
                // to complete any potential actions required.
                event.complete('success');

                const paymentIntent =
                    await this.stripePaymentRequestButton.confirmPaymentRequestButton(viewModel.clientSecret);

                // Handle payment error, if any.
                if (paymentIntent) {
                    this.paymentSuccess = true;
                } else {
                    this.paymentSuccess = false;
                }
            }
        }
    }

    selectSection(section: Section) {
        if (section === Section.MOBILE &&
            (this.stripePaymentRequestButton.canMakePayment === null || !this.stripePaymentRequestButton.canMakePayment)) {
            return;
        }
        this.activeSection = section;
        this.checkForValidity();
    }

    trackByFn(index: number, item: CardViewModel) {
        return index;
    }
}
