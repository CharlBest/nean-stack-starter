import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PaymentService } from '../payment.service';

@Component({
    selector: 'app-stripe-payment',
    templateUrl: './stripe-payment.component.html',
    styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

    @Output() isDoneLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardNumber') cardNumber: ElementRef<HTMLDivElement>;
    @ViewChild('cardExpiry') cardExpiry: ElementRef<HTMLDivElement>;
    @ViewChild('cardCvc') cardCvc: ElementRef<HTMLDivElement>;

    elementsWrapper = new ElementsWrapper();
    error: string;

    constructor(private paymentService: PaymentService) { }

    ngOnInit() {
        if (this.paymentService.stripeInstance) {
            this.elementsOnInit();
        } else {
            this.paymentService.stripeInitialized.subscribe(data => {
                if (data) {
                    this.elementsOnInit();
                }
            });
        }
    }

    elementsOnInit() {
        // Initialize elements
        const elements = this.paymentService.stripe.elements({
            locale: 'en',
            fonts: [
                // TODO: This is not working
                { src: 'assets/open-sans-v15-latin-regular.woff2' }
            ]
        });

        const elementStyles = {
            base: {
                fontFamily: 'Open Sans',
                fontSmoothing: 'antialiased',
            }
        };

        // Card number
        this.elementsWrapper.cardNumber.element = elements.create(this.elementsWrapper.cardNumber.type, {
            placeholder: 'Card Number',
            style: elementStyles
        });

        // Card expiry
        this.elementsWrapper.cardExpiry.element = elements.create(this.elementsWrapper.cardExpiry.type, {
            style: elementStyles
        });

        // Card CVC
        this.elementsWrapper.cardCvc.element = elements.create(this.elementsWrapper.cardCvc.type, {
            style: elementStyles
        });

        this.initializeElement(this.elementsWrapper.cardNumber);
        this.initializeElement(this.elementsWrapper.cardExpiry);
        this.initializeElement(this.elementsWrapper.cardCvc);
    }

    initializeElement(elementWrapper: ElementWrapper) {
        elementWrapper.element.mount(this[elementWrapper.type].nativeElement);
        elementWrapper.element.on('ready', () => {
            if (this.elementsWrapper.readyCount < 2) {
                this.elementsWrapper.readyCount++;
            } else {
                this.elementsWrapper.isLoading = false;
                this.elementsWrapper.cardNumber.element.focus();
                this.isDoneLoading.emit(true);
            }
        });
        // change (empty, complete, error, value), ready, focus, blur, click
        elementWrapper.element.on('change', data => {
            if (data && data.error && data.error.type === 'validation_error') {
                elementWrapper.error = data.error.message;
            } else {
                elementWrapper.error = null;
            }
        });
    }

    async generateToken() {
        // createToken takes a single element but pulls in other elements that has been instantiated as well to create a card element
        const { token, error } = await this.paymentService.stripe.createToken(this.elementsWrapper.cardNumber.element);

        if (error) {
            this.error = error.message;
            return null;
        } else {
            return token;
        }
    }
}

class ElementsWrapper {
    isLoading = true;
    readyCount = 0;

    cardNumber: ElementWrapper = {
        type: 'cardNumber'
    };
    cardExpiry: ElementWrapper = {
        type: 'cardExpiry'
    };
    cardCvc: ElementWrapper = {
        type: 'cardCvc'
    };
}

interface ElementWrapper {
    type: 'cardNumber' | 'cardExpiry' | 'cardCvc';
    element?: any; /*stripe.elements.Element*/
    error?: string;
}
