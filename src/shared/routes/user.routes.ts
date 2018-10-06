import { BaseRoute } from './base.route';

export class UserRoutes {

    private static rootRoute = 'user';

    static createUser = () => new BaseRoute(UserRoutes.rootRoute, 'createUser');
    static doesUsernameAndEmailExist = () => new BaseRoute(UserRoutes.rootRoute, 'doesUsernameAndEmailExist');
    static forgotPassword = () => new BaseRoute(UserRoutes.rootRoute, 'forgotPassword');
    static changeForgottenPassword = () => new BaseRoute(UserRoutes.rootRoute, 'changeForgottenPassword');
    static login = () => new BaseRoute(UserRoutes.rootRoute, 'login');
    static getUserProfile = () => new BaseRoute(UserRoutes.rootRoute, 'getUserProfile');
    static getUserPublic = (id?: number) => new BaseRoute(UserRoutes.rootRoute, 'getUserPublic', { id });
    static updateAvatar = () => new BaseRoute(UserRoutes.rootRoute, 'updateAvatar');
    static updateBio = () => new BaseRoute(UserRoutes.rootRoute, 'updateBio');
    static updatePassword = () => new BaseRoute(UserRoutes.rootRoute, 'updatePassword');
    static deleteUser = () => new BaseRoute(UserRoutes.rootRoute, 'deleteUser');
    static resendEmailVerificationLink = () => new BaseRoute(UserRoutes.rootRoute, 'resendEmailVerificationLink');
    static report = () => new BaseRoute(UserRoutes.rootRoute, 'report');
    static verifyEmail = () => new BaseRoute(UserRoutes.rootRoute, 'verifyEmail');
    static search = () => new BaseRoute(UserRoutes.rootRoute, 'search');
    static searchUserStartWith = () => new BaseRoute(UserRoutes.rootRoute, 'searchUserStartWith');
    static completedTutorial = () => new BaseRoute(UserRoutes.rootRoute, 'completedTutorial');
    static updatePushSubscription = () => new BaseRoute(UserRoutes.rootRoute, 'updatePushSubscription');
}
