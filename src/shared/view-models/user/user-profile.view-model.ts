import { NotificationPreferencesModel } from '../../models/user/notification-preferences.model';
import { CardViewModel } from '../payment/card.view-model';

export class UserProfileViewModel implements NotificationPreferencesModel {
    id: number;
    uId: string;
    email: string;
    username: string;
    dateCreated: number;
    bio: string;
    avatarUrl: string | null | undefined;
    emailVerified: boolean;
    nt1: boolean;
    nt2: boolean;
    hasPushSubscription: boolean;
    userCards: CardViewModel[];
}
