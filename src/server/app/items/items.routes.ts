import { ItemRoutes } from '../../../shared/routes/item.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { ItemsController } from './items.controller';

export class ItemsRoutes extends BaseRoute {
    itemsController: ItemsController;

    constructor() {
        super();
        this.itemsController = new ItemsController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(ItemRoutes.create().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.create(req, res, next).catch(next));
        this.router.post(ItemRoutes.update().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.update(req, res, next).catch(next));
        this.router.post(ItemRoutes.get().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.get(req, res, next).catch(next));
        this.router.post(ItemRoutes.getAll().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.getAll(req, res, next).catch(next));
        this.router.post(ItemRoutes.delete().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.delete(req, res, next).catch(next));
    }
}
