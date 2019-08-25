import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { StripeElementsService } from '../stripe-elements.service';

@Component({
    selector: 'app-stripe-payment-request-button',
    templateUrl: './stripe-payment-request-button.component.html',
    styleUrls: ['./stripe-payment-request-button.component.scss']
})
export class StripePaymentRequestButtonComponent implements OnInit, OnChanges {

    @Input() amount: number;
    @Input() showButton = false;
    @Output() paymentComplete: EventEmitter<stripe.paymentRequest.StripeTokenPaymentResponse> =
        new EventEmitter<stripe.paymentRequest.StripeTokenPaymentResponse>();
    @ViewChild('paymentRequestButton', { static: true }) paymentRequestButton: ElementRef<HTMLDivElement>;
    canMakePayment: { applePay?: boolean } | null = null;
    showPaymentRequestButton = false;
    paymentRequestButtonInstance: stripe.paymentRequest.StripePaymentRequest;
    paymentRequestButtonOptions = {
        country: 'IE',
        currency: 'eur',
        total: {
            label: 'Donation',
            amount: this.amount ? this.amount * 100 : 0,
        },
        requestPayerName: false,
        requestPayerEmail: true,
    };

    constructor(private stripeElementsService: StripeElementsService,
        public themeService: ThemeService) { }

    ngOnInit() {
        if (this.stripeElementsService.stripeInstance) {
            this.initialize();
        } else {
            this.stripeElementsService.stripeInitialized.subscribe((data: boolean) => {
                if (data) {
                    this.initialize();
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.amount && this.paymentRequestButtonInstance) {
            this.paymentRequestButtonOptions.total.amount = this.amount * 100;
            const newOptions = {
                currency: this.paymentRequestButtonOptions.currency,
                total: {
                    label: this.paymentRequestButtonOptions.total.label,
                    amount: this.paymentRequestButtonOptions.total.amount,
                },
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
    completePaymentRequest(tokenPaymentResponse: stripe.paymentRequest.StripeTokenPaymentResponse, code: TokenPaymentCompleteCode) {
        tokenPaymentResponse.complete(code);
    }

    private async initialize() {
        this.paymentRequestButtonInstance = this.stripeElementsService.stripe.paymentRequest(this.paymentRequestButtonOptions);
        // Check the availability of the Payment Request API first.
        this.canMakePayment = await this.paymentRequestButtonInstance.canMakePayment();

        if (this.showButton && this.canMakePayment) {
            this.createAndMountButton();
        } else {
            // TODO: payment button not available
        }

        this.paymentRequestButtonInstance.on('token', (event: stripe.paymentRequest.StripeTokenPaymentResponse) =>
            this.paymentComplete.emit(event));
    }

    private createAndMountButton() {
        const element = this.stripeElementsService.elementsInstance.create('paymentRequestButton', {
            paymentRequest: this.paymentRequestButtonInstance,
            style: {
                paymentRequestButton: {
                    type: 'default', // default: 'default'. Options: 'default' | 'donate' | 'buy'
                    theme: this.themeService.isDarkTheme ? 'dark' : 'light', // default: 'dark'. Options: 'dark' | 'light' | 'light-outline'
                    height: '64px', // default: '40px', the width is always '100%'
                },
            },
        });

        element.mount(this.paymentRequestButton.nativeElement);
        this.showPaymentRequestButton = true;
    }
}

type TokenPaymentCompleteCode =
    'success' |
    'fail' |
    'invalid_payer_name' |
    'invalid_payer_phone' |
    'invalid_payer_email' |
    'invalid_shipping_address';
