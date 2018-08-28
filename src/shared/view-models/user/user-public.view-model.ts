import { ItemModel } from '../../models/item/item.model';

export class UserPublicViewModel {
    uId: string;
    username: string;
    isVerified: boolean;
    bio: string;
    avatarUrl: string;
    items: Array<ItemModel>;
}
