import * as path from 'path';

export class BaseRepository {

    constructor() { }

    protected getQueryPath(folder: Folder, file: Posts | Users): string {
        let fileName;
        switch (folder) {
            case Folder.Posts:
                fileName = Posts[file];
                break;

            case Folder.Users:
                fileName = Users[file];
                break;

            default:
                throw new Error(`Query file name error`);
        }
        return `${Folder[folder]}/${fileName}.cyp`;
    }
}

export enum Folder {
    Posts,
    Users
}

export enum Posts {
}

export enum Users {
    AddForgottenPasswordCode,
    ChangeForgottenPassword,
    CreateNewsletterMember,
    CreateUser,
    DeleteNewsletterMember,
    DoesUserHavePermissions,
    DoesUsernameAndEmailExist,
    GetUser,
    GetUserById,
    VerifyEmail,
    UpdateAvatar,
    UpdateBio,
    UpdatePassword,
    DeleteUser,
    CompletedTutorial
}
