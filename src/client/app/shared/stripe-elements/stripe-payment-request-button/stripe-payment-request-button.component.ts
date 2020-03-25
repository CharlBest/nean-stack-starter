import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
    @Output() readonly paymentComplete: EventEmitter<stripe.paymentRequest.StripeTokenPaymentResponse> =
        new EventEmitter<stripe.paymentRequest.StripeTokenPaymentResponse>();
    @ViewChild('paymentRequestButton', { static: true }) paymentRequestButton: ElementRef<HTMLDivElement>;
    paymentRequestElement: stripe.elements.Element;
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
        // Convert to boolean and then get the opposite
        requestPayerEmail: !!!this.isAuthenticated,
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
    completePaymentRequest(tokenPaymentResponse: stripe.paymentRequest.StripeTokenPaymentResponse, code: TokenPaymentCompleteCode) {
        tokenPaymentResponse.complete(code);
    }

    private setDynamicOptions() {
        this.paymentRequestButtonOptions.total.amount = this.amount ? this.amount * 100 : 0;
    }

    private async initialize() {
        // Update amount in case new value was assigned during initialization
        this.setDynamicOptions();

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


        const clientSecret = 'temp';

        this.paymentRequestButtonInstance.on('paymentmethod', async (ev) => {
            // Confirm the PaymentIntent without handling potential next actions (yet).
            // tslint:disable-next-line: no-string-literal
            const { error: confirmError } = await this.stripeElementsService.stripe['confirmCardPayment'](clientSecret,
                { payment_method: ev.paymentMethod.id },
                { handleActions: false }
            );

            if (confirmError) {
                // Report to the browser that the payment failed, prompting it to
                // re-show the payment interface, or show an error message and close
                // the payment interface.
                ev.complete('fail');
            } else {
                // Report to the browser that the confirmation was successful, prompting
                // it to close the browser payment method collection interface.
                ev.complete('success');
                // Let Stripe.js handle the rest of the payment flow.
                // tslint:disable-next-line: no-string-literal
                const { error, paymentIntent } = await this.stripeElementsService.stripe['confirmCardPayment'](clientSecret);
                if (error) {
                    // The payment failed -- ask your customer for a new payment method.
                } else {
                    // The payment has succeeded.
                }
            }
        });
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

type TokenPaymentCompleteCode =
    'success' |
    'fail' |
    'invalid_payer_name' |
    'invalid_payer_phone' |
    'invalid_payer_email' |
    'invalid_shipping_address';
