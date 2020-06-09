import { BaseRoute } from './base.route';

export class ReminderRoutes {

    private static root = 'reminder';

    static create = () => new BaseRoute(ReminderRoutes.root, 'create');
    static update = (uId?: string) => new BaseRoute(ReminderRoutes.root, 'update', { uId });
    static delete = (uId?: string) => new BaseRoute(ReminderRoutes.root, 'delete', { uId });
    static getAll = () => new BaseRoute(ReminderRoutes.root, 'getAll');
}
