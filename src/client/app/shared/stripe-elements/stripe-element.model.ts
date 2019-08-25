import { CardBrandType } from './card-brand.enum';

export class ElementsWrapper {
    isRendering = true;
    readyCount = 0;

    cardNumber: ElementWrapper = {
        type: 'cardNumber',
        valid: false,
        cardBrand: CardBrandType.UNKNOWN
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

export interface ElementWrapper {
    type: 'cardNumber' | 'cardExpiry' | 'cardCvc';
    cardBrand?: CardBrandType;
    element?: stripe.elements.Element;
    error?: string | null;
    valid: boolean;
}
