export class UserLiteModel {
    id: number;
    uId: string;
    email: string;
    username: string;
    password: string;
    passwordSalt: string;
    emailCode: string;
    stripeCustomerId: string;
}
