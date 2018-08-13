import { BaseRoute } from './base.route';

export class UserRoutes {

    private static rootRoute = 'user';

    public static createUser = () => new BaseRoute(UserRoutes.rootRoute, 'createUser');
    public static doesUsernameAndEmailExist = () => new BaseRoute(UserRoutes.rootRoute, 'doesUsernameAndEmailExist');
    public static forgotPassword = () => new BaseRoute(UserRoutes.rootRoute, 'forgotPassword');
    public static changeForgottenPassword = () => new BaseRoute(UserRoutes.rootRoute, 'changeForgottenPassword');
    public static login = () => new BaseRoute(UserRoutes.rootRoute, 'login');
    public static getUser = () => new BaseRoute(UserRoutes.rootRoute, 'getUser');
    public static updateAvatar = () => new BaseRoute(UserRoutes.rootRoute, 'updateAvatar');
    public static updateBio = () => new BaseRoute(UserRoutes.rootRoute, 'updateBio');
    public static updatePassword = () => new BaseRoute(UserRoutes.rootRoute, 'updatePassword');
    public static deleteUser = () => new BaseRoute(UserRoutes.rootRoute, 'deleteUser');
    public static resendEmailVerificationLink = () => new BaseRoute(UserRoutes.rootRoute, 'resendEmailVerificationLink');
    public static report = () => new BaseRoute(UserRoutes.rootRoute, 'report');
    public static verifyEmail = () => new BaseRoute(UserRoutes.rootRoute, 'verifyEmail');
    public static search = () => new BaseRoute(UserRoutes.rootRoute, 'search');
    public static searchUserStartWith = () => new BaseRoute(UserRoutes.rootRoute, 'searchUserStartWith');
    public static completedTutorial = () => new BaseRoute(UserRoutes.rootRoute, 'completedTutorial');
}
