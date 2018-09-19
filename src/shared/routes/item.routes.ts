import { BaseRoute } from './base.route';

export class ItemRoutes {

    private static rootRoute = 'item';

    static create = () => new BaseRoute(ItemRoutes.rootRoute, 'create');
    static update = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'update', { uId });
    static get = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'get', { uId });
    static getItems = () => new BaseRoute(ItemRoutes.rootRoute, 'getItems');
    static delete = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'delete', { uId });
    static report = () => new BaseRoute(ItemRoutes.rootRoute, 'report');
    static createFavourite = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'createFavourite', { uId });
    static deleteFavourite = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'deleteFavourite', { uId });
    static getFavourites = () => new BaseRoute(ItemRoutes.rootRoute, 'getFavourites');
    static createComment = () => new BaseRoute(ItemRoutes.rootRoute, 'createComment');
    static updateComment = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'updateComment', { uId });
    static deleteComment = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'deleteComment', { uId });
    static getComments = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'getComments', { uId });
    static getComment = (uId?: string) => new BaseRoute(ItemRoutes.rootRoute, 'getComment', { uId });
}
