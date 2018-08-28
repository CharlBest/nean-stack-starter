import { ItemModel } from '../../models/item/item.model';
import { ItemUserViewModel } from './item-user.view-model';

export class ItemViewModel extends ItemModel {
    user?: ItemUserViewModel;
}
