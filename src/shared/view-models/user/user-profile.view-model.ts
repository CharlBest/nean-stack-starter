import { CardViewModel } from '../payment/card.view-model';

export class UserProfileViewModel {
    id: number;
    uId: string;
    email: string;
    username: string;
    dateCreated: number;
    bio: string;
    avatarUrl: string | null | undefined;
    emailVerified: boolean;
    userCards: CardViewModel[];
}
