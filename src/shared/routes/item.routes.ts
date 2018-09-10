import { BaseRoute } from './base.route';

export class ItemRoutes {

    private static rootRoute = 'item';

    static create = () => new BaseRoute(ItemRoutes.rootRoute, 'create');
    static update = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'update', { uId });
    static get = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'get', { uId });
    static getAll = () => new BaseRoute(ItemRoutes.rootRoute, 'getAll');
    static delete = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'delete', { uId });
    static report = () => new BaseRoute(ItemRoutes.rootRoute, 'report');
}
