import { BaseRoute } from './base.route';

export class ReplyRoutes {

    private static root = 'reply';

    static create = (uId?: string) => new BaseRoute(ReplyRoutes.root, 'create', { uId });
    static update = (uId?: string) => new BaseRoute(ReplyRoutes.root, 'update', { uId });
    static delete = (uId?: string) => new BaseRoute(ReplyRoutes.root, 'delete', { uId });
    static get = (uId?: string) => new BaseRoute(ReplyRoutes.root, 'get', { uId });
    static getAll = (uId?: string) => new BaseRoute(ReplyRoutes.root, 'getAll', { uId });
}
