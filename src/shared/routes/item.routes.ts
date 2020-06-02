import { BaseRoute } from './base.route';

export class ItemRoutes {

    private static root = 'item';

    static create = () => new BaseRoute(ItemRoutes.root, 'create');
    static update = (uId?: string) => new BaseRoute(ItemRoutes.root, 'update', { uId });
    static get = (uId?: string) => new BaseRoute(ItemRoutes.root, 'get', { uId });
    static getAll = () => new BaseRoute(ItemRoutes.root, 'getAll');
    static delete = (uId?: string) => new BaseRoute(ItemRoutes.root, 'delete', { uId });
    static report = () => new BaseRoute(ItemRoutes.root, 'report');
    static createFavourite = (uId?: string) => new BaseRoute(ItemRoutes.root, 'createFavourite', { uId });
    static deleteFavourite = (uId?: string) => new BaseRoute(ItemRoutes.root, 'deleteFavourite', { uId });
    static getFavourites = () => new BaseRoute(ItemRoutes.root, 'getFavourites');
    static orderFavourite = (uId?: string) => new BaseRoute(ItemRoutes.root, 'orderFavourite', { uId });
    static search = () => new BaseRoute(ItemRoutes.root, 'search');
}
