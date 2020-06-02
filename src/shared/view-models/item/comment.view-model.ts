import { CommentModel } from '../../models/item/comment.model';
import { UserOwnerViewModel } from './user-owner.view-model';

export class CommentViewModel extends CommentModel {
    itemUId?: string | null;
    user?: UserOwnerViewModel;
    isItemOwner: boolean;
}
