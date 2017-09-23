export class UserModel {
    id: number;
    uId: string;
    email: string;
    username: string;
    password: string;
    passwordSalt: string;
    dateCreated: number;
    isVerified: boolean;
    views: number;
    bio: string;
    avatarUrl: string;
    emailCode: string;
    emailVerified: boolean;

    // TODO: user role/permission
}
