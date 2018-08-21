import { ItemModel } from '../../models/item/item.model';
import { UserModel } from '../../models/user/user.model';

export class ItemViewModel extends ItemModel {
    user: UserModel;
}
