import * as path from 'path';

export class BaseRepository {

    constructor() { }

    protected getQueryPath(folder: Folder, file: General | Users): string {
        let fileName;
        switch (folder) {
            case Folder.General:
                fileName = General[file];
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
    General,
    Users
}

export enum General {
    CreateNewsletterMember,
    DeleteNewsletterMember,
    PaymentRequest
}

export enum Users {
    AddForgottenPasswordCode,
    ChangeForgottenPassword,
    CreateUser,
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
