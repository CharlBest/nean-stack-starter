import { BaseRoute } from './base.route';

export class ItemRoutes {

    private static rootRoute = 'item';

    public static create = () => new BaseRoute(ItemRoutes.rootRoute, 'create');
    public static update = () => new BaseRoute(ItemRoutes.rootRoute, 'update');
    public static get = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'get', { uId });
    public static getAll = () => new BaseRoute(ItemRoutes.rootRoute, 'getAll');
    public static delete = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'delete', { uId });
    public static report = () => new BaseRoute(ItemRoutes.rootRoute, 'report');
}
