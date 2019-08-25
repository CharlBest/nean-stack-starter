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
    @Output() paymentComplete: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('paymentRequestButton', { static: true }) paymentRequestButton: ElementRef<HTMLDivElement>;
    canMakePayment: boolean | null = null;
    showPaymentRequestButton = false;
    paymentRequestButtonInstance: any;
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

    private async initialize() {
        this.paymentRequestButtonInstance = this.stripeElementsService.stripe.paymentRequest(this.paymentRequestButtonOptions);
        // Check the availability of the Payment Request API first.
        this.canMakePayment = await this.paymentRequestButtonInstance.canMakePayment();

        if (this.showButton && this.canMakePayment) {
            this.createAndMountButton();
        } else {
            // TODO: payment button not available
        }

        this.paymentRequestButtonInstance.on('token', (event: any) => this.paymentComplete.emit(event));
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
