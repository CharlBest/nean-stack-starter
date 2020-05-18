import { StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';
import { CardBrandType } from './card-brand.enum';

export class ElementsWrapper {
    isRendering = true;
    readyCount = 0;

    cardNumber: ElementWrapper<StripeCardNumberElement, 'cardNumber'> = {
        type: 'cardNumber',
        valid: false,
        cardBrand: CardBrandType.UNKNOWN
    };

    cardExpiry: ElementWrapper<StripeCardExpiryElement, 'cardExpiry'> = {
        type: 'cardExpiry',
        valid: false,
    };

    cardCvc: ElementWrapper<StripeCardCvcElement, 'cardCvc'> = {
        type: 'cardCvc',
        valid: false,
    };
}

export interface ElementWrapper<E = StripeCardNumberElement | StripeCardExpiryElement | StripeCardCvcElement, T = 'cardNumber' | 'cardExpiry' | 'cardCvc'> {
    type: T;
    cardBrand?: CardBrandType;
    element?: E;
    error?: string | null;
    valid: boolean;
}
