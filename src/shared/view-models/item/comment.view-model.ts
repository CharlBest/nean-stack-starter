import { CommentModel } from '../../models/item/comment.model';
import { PushSubscriptionModel } from '../../models/user/push-subscription.model';
import { ItemUserViewModel } from './item-user.view-model';

export class CommentViewModel extends CommentModel {
    itemUId?: string | null;
    pushSubscription?: PushSubscriptionModel | null;
    user?: ItemUserViewModel;
}
