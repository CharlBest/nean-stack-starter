import { ItemModel } from '../../models/item/item.model';
import { UserOwnerViewModel } from './user-owner.view-model';

export class ItemViewModel extends ItemModel {
    user?: UserOwnerViewModel;
    favourite?: boolean;
    subscribed?: boolean;
    tags?: Array<string>;
}
