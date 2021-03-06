import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CanMakePaymentResult, PaymentIntent, PaymentRequest, PaymentRequestOptions, PaymentRequestPaymentMethodEvent, StripeError, StripePaymentRequestButtonElement } from '@stripe/stripe-js';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { StripeElementsService } from '../stripe-elements.service';

@Component({
    selector: 'app-stripe-payment-request-button',
    templateUrl: './stripe-payment-request-button.component.html',
    styleUrls: ['./stripe-payment-request-button.component.scss']
})
export class StripePaymentRequestButtonComponent implements OnInit, OnChanges, OnDestroy {

    @Input() amount: number;
    @Input() showButton = false;
    @Output() readonly paymentMethod: EventEmitter<PaymentRequestPaymentMethodEvent> = new EventEmitter<PaymentRequestPaymentMethodEvent>();
    @ViewChild('paymentRequestButton', { static: true }) paymentRequestButton: ElementRef<HTMLDivElement>;
    paymentRequestElement: StripePaymentRequestButtonElement;
    canMakePayment: CanMakePaymentResult | null = null;
    showPaymentRequestButton = false;
    paymentRequestButtonInstance: PaymentRequest;
    error: string;
    paymentRequestButtonOptions: PaymentRequestOptions = {
        country: 'IE',
        currency: 'eur',
        total: {
            label: 'Donation',
            amount: this.amount ? this.amount * 100 : 0,
        },
        requestPayerName: false,
        // Convert to boolean and then get the opposite
        requestPayerEmail: !!!this.authService.isAuthenticated,
    };

    constructor(private stripeElementsService: StripeElementsService,
        private authService: AuthService,
        public themeService: ThemeService) { }

    async ngOnInit(): Promise<void> {
        await this.stripeElementsService.stripe();
        await this.initialize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.amount && this.paymentRequestButtonInstance) {
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

    activatePaymentRequestButton(): void {
        this.paymentRequestButtonInstance.show();
    }

    private setDynamicOptions(): void {
        this.paymentRequestButtonOptions.total.amount = this.amount ? this.amount * 100 : 0;
    }

    private async initialize(): Promise<void> {
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

        this.paymentRequestButtonInstance.on('paymentmethod', event => this.paymentMethod.emit(event));
    }

    private createAndMountButton(): void {
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

    async confirmPaymentRequestButton(intentSecret: string, paymentMethodId?: string): Promise<PaymentIntent | null> {
        const stripe = await this.stripeElementsService.stripe();

        let confirmPayment: { paymentIntent?: PaymentIntent; error?: StripeError };
        if (paymentMethodId) {
            confirmPayment = await stripe.confirmCardPayment(
                intentSecret,
                { payment_method: paymentMethodId },
                { handleActions: false }
            );
        } else {
            confirmPayment = await stripe.confirmCardPayment(intentSecret);
        }

        if (confirmPayment.error) {
            // Display error.message in your UI.
            this.error = confirmPayment.error.message ? confirmPayment.error.message : 'Error in payment';
            return null;
        } else if (confirmPayment.paymentIntent && confirmPayment.paymentIntent.status === 'succeeded') {
            // The payment has succeeded
            // Display a success message
            // Handle successful payment here
            return confirmPayment.paymentIntent;
        }

        return null;
    }

    ngOnDestroy(): void {
        if (this.paymentRequestElement) {
            this.paymentRequestElement.destroy();
        }
    }
}
