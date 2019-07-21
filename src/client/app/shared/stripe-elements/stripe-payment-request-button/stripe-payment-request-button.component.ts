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
    @Output() paymentComplete: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('paymentRequestButton', { static: true }) paymentRequestButton: ElementRef<HTMLDivElement>;

    showPaymentRequestButton = false;
    paymentRequestButtonInstance: any;
    paymentRequestButtonOptions = {
        country: 'IE',
        currency: 'eur',
        total: {
            label: 'Donation',
            amount: this.amount ? this.amount : 0,
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
            this.paymentRequestButtonOptions.total.amount = this.amount;
            this.paymentRequestButtonInstance.update(this.paymentRequestButtonOptions);
        }
    }

    initialize() {
        this.paymentRequestButtonInstance = this.stripeElementsService.stripe.paymentRequest(this.paymentRequestButtonOptions);

        this.createAndMountButton();

        this.paymentRequestButtonInstance.on('token', (event: any) => this.paymentComplete.emit(event));
    }

    createAndMountButton() {
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

        (async () => {
            // Check the availability of the Payment Request API first.
            const result = await this.paymentRequestButtonInstance.canMakePayment();
            if (result) {
                element.mount(this.paymentRequestButton.nativeElement);
                this.showPaymentRequestButton = true;
            } else {
                // TODO: payment button not available
            }
        })();
    }
}
