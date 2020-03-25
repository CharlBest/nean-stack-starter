import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CardModel } from '@shared/models/payment/card.model';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { AnonymousPaymentViewModel } from '@shared/view-models/payment/anonymous-payment.view-model';
import { UserPaymentViewModel } from '@shared/view-models/payment/user-payment.view-model';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { AuthService } from '../../shared/services/auth.service';
import { StripeElementsComponent } from '../../shared/stripe-elements/stripe-elements/stripe-elements.component';
// tslint:disable-next-line: max-line-length
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
    paymentCards: CardModel[];
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

            const firstCardUId = this.paymentCards && this.paymentCards.length > 0 ? this.paymentCards[0].uId : 'new';
            this.formGroup.controls.cardUId.setValue(firstCardUId);
        }
    }

    async onSubmit() {
        if (this.activeSection === Section.CARD) {
            if (this.formGroup.controls.cardUId.value === 'new') {
                this.isProcessing = true;
                let success = false;

                const clientSecret = await this.sendPaymentToServer();
                if (clientSecret) {
                    success = await this.stripeElementsComponent.confirmCardPayment(clientSecret);
                }

                if (success) {
                    this.paymentSuccess = true;
                } else {
                    this.dialogService.alert('Invalid card details');
                }

                this.isProcessing = false;
            } else {
                // TODO: handle scenario
            }
        } else if (this.activeSection === Section.MOBILE) {
            this.stripePaymentRequestButton.activatePaymentRequestButton();
        }
    }

    sendPaymentToServer(): Promise<string | null> {
        if (this.isAuthenticated) {
            return this.sendViaAuthenticatedUser();
        } else {
            return this.sendViaAnonymousUser();
        }
    }

    async sendViaAuthenticatedUser(): Promise<string | null> {
        const viewModel = new UserPaymentViewModel();
        viewModel.cardUId = this.formGroup.controls.cardUId.value;
        viewModel.amount = +this.formGroup.controls.amount.value * 100; // convert to cent
        viewModel.saveCard = this.formGroup.controls.saveCard.value === true;

        try {
            return await this.paymentService.userPayment(viewModel);
        } catch (error) {
            this.formErrorsService.updateFormValidity(error, this.formGroup);
            return null;
        }
    }

    async sendViaAnonymousUser(): Promise<string | null> {
        const viewModel = new AnonymousPaymentViewModel();
        viewModel.email = this.formGroup.controls.email.value;
        viewModel.amount = +this.formGroup.controls.amount.value * 100; // convert to cent

        try {
            return await this.paymentService.anonymousPayment(viewModel);
        } catch (error) {
            this.formErrorsService.updateFormValidity(error, this.formGroup);
            return null;
        }
    }

    // TODO: this is bad practice. This method will be called to many unnecessary times. Fix!
    checkForValidity() {
        // Form validity (Amount is required)
        if (!this.formGroup.valid) {
            this.isFormValid = false;
        }

        // Card payment
        if (this.activeSection === Section.CARD) {
            // Not authenticated AND stripe elements is valid and email is required
            if (!this.isAuthenticated && (!this.stripeElementsComponent.isValid ||
                this.formGroup.controls.email.value === null || this.formGroup.controls.email.value === '')) {
                this.isFormValid = false;
            }

            // Authenticated AND new card and stipe elements is valid
            if (this.isAuthenticated
                && this.formGroup.controls.cardUId.value === 'new'
                && !this.stripeElementsComponent.isValid) {
                this.isFormValid = false;
            }
        } else if (this.activeSection === Section.MOBILE) {
            // Mobile payment
            this.isFormValid = !!this.stripePaymentRequestButton.canMakePayment;
        }

        this.isFormValid = true;
    }

    async paymentRequestButtonComplete(event: stripe.paymentRequest.StripeTokenPaymentResponse) {
        if (event && event.token && (event.payerEmail || this.isAuthenticated)) {
            if (!this.isAuthenticated) {
                this.formGroup.controls.email.setValue(event.payerEmail);
            }

            // const success = await this.sendPaymentToServer(event.token.id);
            // if (success) {
            //     this.stripePaymentRequestButton.completePaymentRequest(event, 'success');
            //     return;
            // }
        } else {
            this.dialogService.alert('Invalid card details');
        }

        this.stripePaymentRequestButton.completePaymentRequest(event, 'fail');
    }

    selectSection(section: Section) {
        if (section === Section.MOBILE &&
            (this.stripePaymentRequestButton.canMakePayment === null || !this.stripePaymentRequestButton.canMakePayment)) {
            return;
        }
        this.activeSection = section;
        this.checkForValidity();
    }

    trackByFn(index: number, item: CardModel) {
        return index;
    }
}
