import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { StripeElementsService } from '../stripe-elements.service';

@Component({
    selector: 'app-stripe-elements',
    templateUrl: './stripe-elements.component.html',
    styleUrls: ['./stripe-elements.component.scss']
})
export class StripeElementsComponent implements OnInit {

    @Output() isDoneRendering: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardNumber') cardNumber: ElementRef<HTMLDivElement>;
    @ViewChild('cardExpiry') cardExpiry: ElementRef<HTMLDivElement>;
    @ViewChild('cardCvc') cardCvc: ElementRef<HTMLDivElement>;

    elementsWrapper = new ElementsWrapper();
    cardBrandType = CardBrandType;
    error: string;
    isValid = false;

    constructor(private stripeElementsService: StripeElementsService) { }

    ngOnInit() {
        if (this.stripeElementsService.stripeInstance) {
            this.elementsOnInit();
        } else {
            this.stripeElementsService.stripeInitialized.subscribe(data => {
                if (data) {
                    this.elementsOnInit();
                }
            });
        }
    }

    elementsOnInit() {
        // Initialize elements
        const elements = this.stripeElementsService.stripe.elements({
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
                this.elementsWrapper.isRendering = false;
                this.elementsWrapper.cardNumber.element.focus();
                this.isDoneRendering.emit(true);
            }
        });
        // change (empty, complete, error, value), ready, focus, blur, click
        elementWrapper.element.on('change', data => {
            elementWrapper.valid = data && data.error === undefined && data.empty === false;
            this.isValid = this.elementsWrapper.cardNumber.valid && this.elementsWrapper.cardExpiry.valid && this.elementsWrapper.cardCvc.valid;

            if (data && data.error && data.error.type === 'validation_error') {
                elementWrapper.error = data.error.message;
            } else {
                elementWrapper.error = null;
            }

            // Card brand
            if (data && data.elementType === 'cardNumber' && data.brand) {
                switch (data.brand) {
                    case 'visa':
                        elementWrapper.cardBrand = CardBrandType.Visa;
                        break;
                    case 'mastercard':
                        elementWrapper.cardBrand = CardBrandType.MasterCard;
                        break;
                    case 'amex':
                        elementWrapper.cardBrand = CardBrandType.AmericanExpress;
                        break;
                    case 'discover':
                        elementWrapper.cardBrand = CardBrandType.Discover;
                        break;
                    case 'diners':
                        elementWrapper.cardBrand = CardBrandType.DinnersClub;
                        break;
                    case 'jcb':
                        elementWrapper.cardBrand = CardBrandType.JCB;
                        break;
                    case 'unionpay':
                        elementWrapper.cardBrand = CardBrandType.UnionPay;
                        break;

                    default:
                        elementWrapper.cardBrand = CardBrandType.Unknown;
                        break;
                }
            }
        });
    }

    async generateToken() {
        // createToken takes a single element but pulls in other elements that has been instantiated as well to create a card element
        const { token, error } = await this.stripeElementsService.stripe.createToken(this.elementsWrapper.cardNumber.element);

        if (error) {
            this.error = error.message;
            return null;
        } else {
            return token;
        }
    }
}

class ElementsWrapper {
    isRendering = true;
    readyCount = 0;

    cardNumber: ElementWrapper = {
        type: 'cardNumber',
        valid: false,
        cardBrand: CardBrandType.Unknown
    };
    cardExpiry: ElementWrapper = {
        type: 'cardExpiry',
        valid: false,
    };
    cardCvc: ElementWrapper = {
        type: 'cardCvc',
        valid: false,
    };
}

interface ElementWrapper {
    type: 'cardNumber' | 'cardExpiry' | 'cardCvc';
    cardBrand?: CardBrandType;
    element?: any; /*stripe.elements.Element*/
    error?: string;
    valid: boolean;
}

enum CardBrandType {
    Unknown = 1,
    Visa = 2,
    MasterCard = 3,
    DinnersClub = 4,
    Discover = 5,
    AmericanExpress = 6,
    JCB = 7,
    UnionPay = 8,
}