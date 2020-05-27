import { FileModel } from '../../models/shared/file.model';
import { CardViewModel } from '../payment/card.view-model';

export class UserProfileViewModel {
    id: number;
    uId: string;
    email: string;
    username: string;
    stripeCustomerId?: string;
    dateCreated: number;
    bio: string;
    avatar?: FileModel | null;
    emailVerified: boolean;
    twoFactorAuthenticationEnabled: boolean;
    paymentCards: CardViewModel[];
}
