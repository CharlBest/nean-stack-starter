import { CommentModel } from '../../models/comment/comment.model';
import { UserOwnerViewModel } from '../item/user-owner.view-model';

export class CommentViewModel extends CommentModel {
    itemUId?: string | null;
    user?: UserOwnerViewModel;
    isItemOwner: boolean;
}
