import { ItemViewModel } from '../item/item.view-model';

export class UserPublicViewModel {
    uId: string;
    username: string;
    isVerified: boolean;
    bio: string;
    avatarUrl: string;
    items: Array<ItemViewModel>;
}
