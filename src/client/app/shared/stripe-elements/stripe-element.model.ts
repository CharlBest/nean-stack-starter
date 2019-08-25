import { CardBrandType } from './card-brand.enum';

export class ElementsWrapper {
    isRendering = true;
    readyCount = 0;

    cardNumber: ElementWrapper;
    cardExpiry: ElementWrapper;
    cardCvc: ElementWrapper;

    constructor(cardNumberElement: stripe.elements.Element, cardExpiryElement: stripe.elements.Element, cardCvc: stripe.elements.Element) {
        this.cardNumber = {
            element: cardNumberElement,
            type: 'cardNumber',
            valid: false,
            cardBrand: CardBrandType.UNKNOWN
        };

        this.cardExpiry = {
            element: cardExpiryElement,
            type: 'cardExpiry',
            valid: false,
        };

        this.cardCvc = {
            element: cardCvc,
            type: 'cardCvc',
            valid: false,
        };
    }
}

export interface ElementWrapper {
    type: 'cardNumber' | 'cardExpiry' | 'cardCvc';
    cardBrand?: CardBrandType;
    element: stripe.elements.Element;
    error?: string | null;
    valid: boolean;
}
