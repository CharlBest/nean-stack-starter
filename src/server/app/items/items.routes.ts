import { ItemRoutes } from '@shared/routes/item.routes';
import { Authentication } from '../../core/middleware/authentication';
import { BaseRoute } from '../shared/base-route';
import { itemsController } from './items.controller';

class ItemsRoutes extends BaseRoute {

    constructor() {
        super();
        this.initAnonymousRoutes();
        this.initAuthenticatedRoutes();
    }

    initAnonymousRoutes() {
        this.router.get(ItemRoutes.get().server(),
            async (req, res, next) => itemsController.get(req, res, next).catch(next));

        this.router.get(ItemRoutes.getAll().server(),
            async (req, res, next) => itemsController.getAll(req, res, next).catch(next));

        this.router.post(ItemRoutes.search().server(),
            async (req, res, next) => itemsController.search(req, res, next).catch(next));
    }

    initAuthenticatedRoutes() {
        this.router.post(ItemRoutes.create().server(), Authentication.loginRequired,
            async (req, res, next) => itemsController.create(req, res, next).catch(next));

        this.router.put(ItemRoutes.update().server(), Authentication.loginRequired,
            async (req, res, next) => itemsController.update(req, res, next).catch(next));

        this.router.delete(ItemRoutes.delete().server(), Authentication.loginRequired,
            async (req, res, next) => itemsController.delete(req, res, next).catch(next));

        this.router.post(ItemRoutes.createFavourite().server(), Authentication.loginRequired,
            async (req, res, next) => itemsController.createFavourite(req, res, next).catch(next));

        this.router.delete(ItemRoutes.deleteFavourite().server(), Authentication.loginRequired,
            async (req, res, next) => itemsController.deleteFavourite(req, res, next).catch(next));

        this.router.get(ItemRoutes.getFavourites().server(), Authentication.loginRequired,
            async (req, res, next) => itemsController.getFavourites(req, res, next).catch(next));

        this.router.put(ItemRoutes.orderFavourite().server(), Authentication.loginRequired,
            async (req, res, next) => itemsController.orderFavourite(req, res, next).catch(next));
    }
}

export const itemsRoutes = new ItemsRoutes().router;
