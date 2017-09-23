import { BaseRoute } from './base.route';

export class GeneralRoutes {

    private static rootRoute = 'general';

    public static search = new BaseRoute(1, GeneralRoutes.rootRoute, 'search');
    public static searchUserStartWith = new BaseRoute(1, GeneralRoutes.rootRoute, 'searchUserStartWith');
    // TODO: no enpoint yet
    public static sendFeedback = new BaseRoute(1, GeneralRoutes.rootRoute, 'sendFeedback');
}
