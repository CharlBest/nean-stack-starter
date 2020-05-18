import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CanMakePaymentResult, PaymentRequest, PaymentRequestCompleteStatus, PaymentRequestOptions, PaymentRequestTokenEvent, StripePaymentRequestButtonElement } from '@stripe/stripe-js';
import { ThemeService } from '../../services/theme.service';
import { StripeElementsService } from '../stripe-elements.service';

@Component({
    selector: 'app-stripe-payment-request-button',
    templateUrl: './stripe-payment-request-button.component.html',
    styleUrls: ['./stripe-payment-request-button.component.scss']
})
export class StripePaymentRequestButtonComponent implements OnInit, OnChanges, OnDestroy {

    @Input() amount: number;
    @Input() isAuthenticated: boolean;
    @Input() showButton = false;
    @Output() readonly paymentComplete: EventEmitter<PaymentRequestTokenEvent> = new EventEmitter<PaymentRequestTokenEvent>();
    @ViewChild('paymentRequestButton', { static: true }) paymentRequestButton: ElementRef<HTMLDivElement>;
    paymentRequestElement: StripePaymentRequestButtonElement;
    canMakePayment: CanMakePaymentResult | null = null;
    showPaymentRequestButton = false;
    paymentRequestButtonInstance: PaymentRequest;
    paymentRequestButtonOptions: PaymentRequestOptions = {
        country: 'IE',
        currency: 'eur',
        total: {
            label: 'Donation',
            amount: this.amount ? this.amount * 100 : 0,
        },
        requestPayerName: false,
        // Convert to boolean and then get the opposite
        requestPayerEmail: !!!this.isAuthenticated,
    };

    constructor(private stripeElementsService: StripeElementsService,
        public themeService: ThemeService) { }

    async ngOnInit() {
        await this.stripeElementsService.stripe();
        await this.initialize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.amount || changes.isAuthenticated) && this.paymentRequestButtonInstance) {
            this.setDynamicOptions();

            const newOptions = {
                // TODO: not sure if all properties have to be provided for an update
                currency: this.paymentRequestButtonOptions.currency,
                total: {
                    label: this.paymentRequestButtonOptions.total.label,
                    amount: this.paymentRequestButtonOptions.total.amount,
                }
            };
            this.paymentRequestButtonInstance.update(newOptions);
        }
    }

    activatePaymentRequestButton() {
        this.paymentRequestButtonInstance.show();
    }

    // NB: it's very important to call this after payment request was made otherwise it will always
    // show error but payment might have succeeded.
    // https://stripe.com/docs/stripe-js/reference#payment-response-object
    completePaymentRequest(tokenPaymentResponse: PaymentRequestTokenEvent, code: PaymentRequestCompleteStatus) {
        tokenPaymentResponse.complete(code);
    }

    private setDynamicOptions() {
        this.paymentRequestButtonOptions.total.amount = this.amount ? this.amount * 100 : 0;
    }

    private async initialize() {
        // Update amount in case new value was assigned during initialization
        this.setDynamicOptions();

        const stripe = await this.stripeElementsService.stripe();
        this.paymentRequestButtonInstance = stripe.paymentRequest(this.paymentRequestButtonOptions);
        // Check the availability of the Payment Request API first.
        this.canMakePayment = await this.paymentRequestButtonInstance.canMakePayment();

        if (this.showButton && this.canMakePayment) {
            this.createAndMountButton();
        } else {
            // TODO: payment button not available
        }

        this.paymentRequestButtonInstance.on('token', event => this.paymentComplete.emit(event));
    }

    private createAndMountButton() {
        this.paymentRequestElement = this.stripeElementsService.elementsInstance.create('paymentRequestButton', {
            paymentRequest: this.paymentRequestButtonInstance,
            style: {
                paymentRequestButton: {
                    type: 'default', // default: 'default'. Options: 'default' | 'donate' | 'buy'
                    theme: this.themeService.isDarkTheme ? 'dark' : 'light', // default: 'dark'. Options: 'dark' | 'light' | 'light-outline'
                    height: '64px', // default: '40px', the width is always '100%'
                },
            },
        });

        this.paymentRequestElement.mount(this.paymentRequestButton.nativeElement);
        this.showPaymentRequestButton = true;
    }

    ngOnDestroy() {
        if (this.paymentRequestElement) {
            this.paymentRequestElement.destroy();
        }
    }
}
