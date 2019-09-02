export class UserLiteModel {
    id: number;
    uId: string;
    email: string;
    username: string;
    passwordHash: string;
    emailCode: string;
    stripeCustomerId: string;
    twoFactorAuthenticationEnabled: boolean;
    twoFactorAuthenticationSecret: string;
    consent: boolean;
    darkTheme: boolean;
    language: string;
}
