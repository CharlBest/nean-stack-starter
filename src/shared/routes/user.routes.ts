import { BaseRoute } from './base.route';

export class UserRoutes {

    private static root = 'user';

    static createUser = () => new BaseRoute(UserRoutes.root, 'createUser');
    static doesUsernameAndEmailExist = () => new BaseRoute(UserRoutes.root, 'doesUsernameAndEmailExist');
    static forgotPassword = () => new BaseRoute(UserRoutes.root, 'forgotPassword');
    static changeForgottenPassword = () => new BaseRoute(UserRoutes.root, 'changeForgottenPassword');
    static login = () => new BaseRoute(UserRoutes.root, 'login');
    static getUserProfile = () => new BaseRoute(UserRoutes.root, 'getUserProfile');
    static getUserPublic = (id?: number) => new BaseRoute(UserRoutes.root, 'getUserPublic', { id });
    static getUserPublicItems = (id?: number) => new BaseRoute(UserRoutes.root, 'getUserPublicItems', { id });
    static updateAvatar = () => new BaseRoute(UserRoutes.root, 'updateAvatar');
    static updateBio = () => new BaseRoute(UserRoutes.root, 'updateBio');
    static updatePassword = () => new BaseRoute(UserRoutes.root, 'updatePassword');
    static deleteUser = () => new BaseRoute(UserRoutes.root, 'deleteUser');
    static resendEmailVerificationLink = () => new BaseRoute(UserRoutes.root, 'resendEmailVerificationLink');
    static report = () => new BaseRoute(UserRoutes.root, 'report');
    static verifyEmail = () => new BaseRoute(UserRoutes.root, 'verifyEmail');
    static search = () => new BaseRoute(UserRoutes.root, 'search');
    static searchUserStartWith = () => new BaseRoute(UserRoutes.root, 'searchUserStartWith');
    static completedTutorial = () => new BaseRoute(UserRoutes.root, 'completedTutorial');
    static updateTwoFactorAuthentication = () => new BaseRoute(UserRoutes.root, 'updateTwoFactorAuthentication');
    static updateConfiguration = () => new BaseRoute(UserRoutes.root, 'updateConfiguration');
}
