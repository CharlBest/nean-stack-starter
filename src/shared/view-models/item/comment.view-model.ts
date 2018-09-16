import { CommentModel } from '../../models/item/comment.model';
import { ItemUserViewModel } from './item-user.view-model';

export class CommentViewModel extends CommentModel {
    user?: ItemUserViewModel;
}
