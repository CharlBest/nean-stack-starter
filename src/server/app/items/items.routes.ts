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
        this.router.post(ItemRoutes.create().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.create(req, res, next).catch(next));
        this.router.put(ItemRoutes.update().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.update(req, res, next).catch(next));
        this.router.get(ItemRoutes.get().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.get(req, res, next).catch(next));
        this.router.get(ItemRoutes.getAll().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.getAll(req, res, next).catch(next));
        this.router.delete(ItemRoutes.delete().server(), Authentication.loginRequired,
            (req, res, next) => this.itemsController.delete(req, res, next).catch(next));
    }
}
