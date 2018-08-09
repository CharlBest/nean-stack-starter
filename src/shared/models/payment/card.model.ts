export class CardModel {
    uId: string;
    stripeCardId: string;
    stripeFingerprint: string;
    expireMonth: number;
    expireYear: number;
    brand: string;
    last4: string;
    dateCreated: number;
    isDefault: boolean;
}
