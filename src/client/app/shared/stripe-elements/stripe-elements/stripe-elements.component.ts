import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CardBrandType } from '../card-brand.enum';
import { ElementsWrapper, ElementWrapper } from '../stripe-element.model';
import { StripeElementsService } from '../stripe-elements.service';

@Component({
    selector: 'app-stripe-elements',
    templateUrl: './stripe-elements.component.html',
    styleUrls: ['./stripe-elements.component.scss']
})
export class StripeElementsComponent implements OnInit {

    @Output() isDoneRendering: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardNumber', { static: true }) cardNumber: ElementRef<HTMLDivElement>;
    @ViewChild('cardExpiry', { static: true }) cardExpiry: ElementRef<HTMLDivElement>;
    @ViewChild('cardCvc', { static: true }) cardCvc: ElementRef<HTMLDivElement>;

    elementsWrapper = new ElementsWrapper();
    cardBrandType = CardBrandType;
    error: string;
    isValid = false;

    constructor(private stripeElementsService: StripeElementsService,
        public themeService: ThemeService) { }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        if (this.stripeElementsService.stripeInstance) {
            this.elementsOnInit();
        } else {
            this.stripeElementsService.stripeInitialized.subscribe((data: boolean) => {
                if (data) {
                    this.elementsOnInit();
                }
            });
        }
    }

    elementsOnInit() {
        const elementStyles = {
            base: {
                color: this.themeService.isDarkTheme ? 'rgba(255, 255, 255)' : 'rgba(0, 0, 0, 0.87)',
                '::placeholder': {
                    color: this.themeService.isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
                }
            }
        };

        // Card number
        this.elementsWrapper.cardNumber.element = this.stripeElementsService.elementsInstance.create(this.elementsWrapper.cardNumber.type, {
            placeholder: 'Card Number *',
            style: elementStyles
        });

        // Card expiry
        this.elementsWrapper.cardExpiry.element = this.stripeElementsService.elementsInstance.create(this.elementsWrapper.cardExpiry.type, {
            placeholder: 'MM / YY *',
            style: elementStyles
        });

        // Card CVC
        this.elementsWrapper.cardCvc.element = this.stripeElementsService.elementsInstance.create(this.elementsWrapper.cardCvc.type, {
            placeholder: 'CVC *',
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
        elementWrapper.element.on('change', (data: any) => {
            elementWrapper.valid = data && data.error === undefined && data.empty === false;
            this.isValid = this.elementsWrapper.cardNumber.valid &&
                this.elementsWrapper.cardExpiry.valid &&
                this.elementsWrapper.cardCvc.valid;

            if (data && data.error && data.error.type === 'validation_error') {
                elementWrapper.error = data.error.message;
            } else {
                elementWrapper.error = null;
            }

            // Card brand
            if (data && data.elementType === 'cardNumber' && data.brand) {
                switch (data.brand) {
                    case 'visa':
                        elementWrapper.cardBrand = CardBrandType.VISA;
                        break;

                    case 'mastercard':
                        elementWrapper.cardBrand = CardBrandType.MASTER_CARD;
                        break;

                    case 'amex':
                        elementWrapper.cardBrand = CardBrandType.AMERICAN_EXPRESS;
                        break;

                    case 'discover':
                        elementWrapper.cardBrand = CardBrandType.DISCOVER;
                        break;

                    case 'diners':
                        elementWrapper.cardBrand = CardBrandType.DINERS_CLUB;
                        break;

                    case 'jcb':
                        elementWrapper.cardBrand = CardBrandType.JCB;
                        break;

                    case 'unionpay':
                        elementWrapper.cardBrand = CardBrandType.UNION_PAY;
                        break;

                    default:
                        elementWrapper.cardBrand = CardBrandType.UNKNOWN;
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
