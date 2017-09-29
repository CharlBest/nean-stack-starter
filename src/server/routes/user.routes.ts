import { BaseRoute } from './base.route';

export class UserRoutes {

    private static rootRoute = 'user';

    public static createUser = new BaseRoute(1, UserRoutes.rootRoute, 'createUser');
    public static doesUsernameAndEmailExist = new BaseRoute(1, UserRoutes.rootRoute, 'doesUsernameAndEmailExist');
    public static forgotPassword = new BaseRoute(1, UserRoutes.rootRoute, 'forgotPassword');
    public static changeForgottenPassword = new BaseRoute(1, UserRoutes.rootRoute, 'changeForgottenPassword');
    public static login = new BaseRoute(1, UserRoutes.rootRoute, 'login');
    public static getUser = new BaseRoute(1, UserRoutes.rootRoute, 'getUser');
    public static updateAvatar = new BaseRoute(1, UserRoutes.rootRoute, 'updateAvatar');
    public static report = new BaseRoute(1, UserRoutes.rootRoute, 'report');
    public static createNewsletterMember = new BaseRoute(1, UserRoutes.rootRoute, 'createNewsletterMember');
    public static deleteNewsletterMember = new BaseRoute(1, UserRoutes.rootRoute, 'deleteNewsletterMember');
    public static verifyEmail = new BaseRoute(1, UserRoutes.rootRoute, 'verifyEmail');
}
