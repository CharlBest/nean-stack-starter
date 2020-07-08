import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { PaymentIntent, StripeCardNumberElement } from '@stripe/stripe-js';
import { ThemeService } from '../../services/theme.service';
import { CardBrandType } from '../card-brand.enum';
import { ElementsWrapper, ElementWrapper } from '../stripe-element.model';
import { StripeElementsService } from '../stripe-elements.service';

@Component({
    selector: 'app-stripe-elements',
    templateUrl: './stripe-elements.component.html',
    styleUrls: ['./stripe-elements.component.scss']
})
export class StripeElementsComponent implements OnInit, OnDestroy {

    @Output() readonly isDoneRendering: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly inputElementChange: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('cardNumber', { static: true }) cardNumber: ElementRef<HTMLDivElement>;
    @ViewChild('cardExpiry', { static: true }) cardExpiry: ElementRef<HTMLDivElement>;
    @ViewChild('cardCvc', { static: true }) cardCvc: ElementRef<HTMLDivElement>;

    elementsWrapper = new ElementsWrapper();
    cardBrandType = CardBrandType;
    error: string;
    isValid = false;

    constructor(private stripeElementsService: StripeElementsService,
        public themeService: ThemeService) { }

    async ngOnInit(): Promise<void> {
        await this.stripeElementsService.stripe();
        this.initialize();
    }

    async confirmCardSetup(intentSecret: string): Promise<string | null | undefined> {
        if (!this.elementsWrapper.cardNumber.element) {
            return null;
        }

        const stripe = await this.stripeElementsService.stripe();
        const { setupIntent, error } = await stripe.confirmCardSetup(
            intentSecret,
            {
                payment_method: {
                    card: this.elementsWrapper.cardNumber.element
                }
            }
        );

        if (error) {
            // Display error.message in your UI.
            return null;
        } else {
            // The SetupIntent was successful!
            return setupIntent?.payment_method;
        }
    }

    async confirmCardPayment(intentSecret: string): Promise<PaymentIntent | null> {
        if (!this.elementsWrapper.cardNumber.element) {
            return null;
        }

        const stripe = await this.stripeElementsService.stripe();
        const confirmPayment = await stripe.confirmCardPayment(intentSecret, {
            payment_method: { card: this.elementsWrapper.cardNumber.element }
        });

        console.log(confirmPayment);

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

    private initialize(): void {
        const elementStyles = {
            base: {
                fontFamily: 'Open Sans, Arial, sans-serif',
                fontSmoothing: 'antialiased',
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

    private initializeElement(elementWrapper: ElementWrapper): void {
        if (!elementWrapper.element) {
            console.error('Failed to create element', elementWrapper);
            return;
        }

        elementWrapper.element.mount(this[elementWrapper.type].nativeElement);
        elementWrapper.element.on('ready', () => {
            if (this.elementsWrapper.readyCount < 2) {
                this.elementsWrapper.readyCount++;
            } else {
                this.elementsWrapper.isRendering = false;
                if (this.elementsWrapper.cardNumber.element) {
                    this.elementsWrapper.cardNumber.element.focus();
                }
                this.isDoneRendering.emit(true);
            }
        });

        this.addChangeEventListener(elementWrapper);
    }

    private addChangeEventListener(elementWrapper: ElementWrapper): void {
        if (!elementWrapper.element) {
            console.error('Failed to add event listener to element', elementWrapper);
            return;
        }

        // change (empty, complete, error, value), ready, focus, blur, click
        (elementWrapper.element as StripeCardNumberElement).on('change', data => {
            if (!data) {
                return;
            }
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


            // Clear global error message
            this.error = '';

            this.inputElementChange.emit();
        });
    }

    ngOnDestroy(): void {
        if (this.elementsWrapper.cardNumber.element) {
            this.elementsWrapper.cardNumber.element.destroy();
        }
        if (this.elementsWrapper.cardExpiry.element) {
            this.elementsWrapper.cardExpiry.element.destroy();
        }
        if (this.elementsWrapper.cardCvc.element) {
            this.elementsWrapper.cardCvc.element.destroy();
        }
    }
}
