import { CardViewModel } from '../payment/card.view-model';

export class UserProfileViewModel {
    uId: string;
    email: string;
    username: string;
    dateCreated: number;
    bio: string;
    avatarUrl: string;
    emailVerified: boolean;
    userCards: CardViewModel[];
}
