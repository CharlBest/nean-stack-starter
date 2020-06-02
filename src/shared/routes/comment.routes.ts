import { BaseRoute } from './base.route';

export class CommentRoutes {

    private static root = 'comment';

    static create = (uId?: string) => new BaseRoute(CommentRoutes.root, 'create', { uId });
    static update = (uId?: string) => new BaseRoute(CommentRoutes.root, 'update', { uId });
    static delete = (uId?: string) => new BaseRoute(CommentRoutes.root, 'delete', { uId });
    static get = (uId?: string) => new BaseRoute(CommentRoutes.root, 'get', { uId });
    static getAll = (uId?: string) => new BaseRoute(CommentRoutes.root, 'getAll', { uId });
}
