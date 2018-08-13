import { BaseRoute } from './base.route';

export class ItemRoutes {

    private static rootRoute = 'item';

    public static create = () => new BaseRoute(ItemRoutes.rootRoute, 'create');
    public static update = () => new BaseRoute(ItemRoutes.rootRoute, 'update');
    public static get = () => new BaseRoute(ItemRoutes.rootRoute, 'get');
    public static getAll = () => new BaseRoute(ItemRoutes.rootRoute, 'getAll');
    public static delete = () => new BaseRoute(ItemRoutes.rootRoute, 'delete');
}
