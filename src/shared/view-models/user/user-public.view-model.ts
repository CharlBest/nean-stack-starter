import { FileModel } from '../../models/shared/file.model';

export class UserPublicViewModel {
    uId: string;
    username: string;
    isVerified: boolean;
    bio: string;
    avatar: FileModel;
    haveItems: boolean;
}
