
export abstract class BaseRepository {

    constructor() { }

    protected getQueryPath(schema: Schema, query: General | Users): string {
        let fileName;
        switch (schema) {
            case Schema.General:
                fileName = General[query];
                break;

            case Schema.Users:
                fileName = Users[query];
                break;

            default:
                throw new Error(`Query file name error`);
        }
        return `${Schema[schema]}/${fileName}.cyp`;
    }
}

export enum Schema {
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
