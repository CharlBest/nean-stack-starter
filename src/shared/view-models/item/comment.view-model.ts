import { CommentModel } from '../../models/item/comment.model';
import { PushSubscriptionViewModel } from '../user/push-subscription.view-model';
import { ItemUserViewModel } from './item-user.view-model';

export class CommentViewModel extends CommentModel {
    itemUId?: string | null;
    pushSubscription?: PushSubscriptionViewModel | null;
    user?: ItemUserViewModel;
}
