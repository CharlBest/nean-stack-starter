import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
// import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
// import { makeExecutableSchema } from 'graphql-tools';
import { Request, Response, NextFunction } from 'express';
import { Server } from './server';
import { ApiError } from './middleware/api-error';
import { Neo4j } from './middleware/neo4j';
import { Database } from './database';
import { UsersRoutes } from '../app/users/users.routes';
// import typeDefs from '../schemas/schema';
// import resolvers from '../resolvers/resolver';
import { Authentication } from './middleware/authentication';
import { environment } from '../environments/environment';
// import { exceptionHandler } from './api/exceptionHandler';
// import { extendExpressResponse } from './api/extendExpressResponse';
const root = './';

export class Bootstrap {

    public defineExpressApp(app: express.Application) {
        app.set('host', environment.appHost);
        app.set('port', Server.normalizePort(environment.port));
    }

    public startServer(app: express.Application): http.Server {
        return app.listen(app.get('port'));
    }

    public setupCoreTools(app: express.Application): void {
        // const swaggerUI = new SwaggerUI();
        // swaggerUI.setup(app);
    }

    public setupRoutes(app: express.Application): void {
        app.use(express.static(path.join(root, 'dist/client-web')));

        // Auth
        app.use(Authentication.setAuthUser);

        // serving api routes
        const usersRouter = new UsersRoutes().router;

        app.use('/api', usersRouter);

        // TODO: not sure if this is the best way of doing it
        // This is to serve web app sub routes
        app.get('*', (req, res) => {
            const webClientUrl = 'dist/client-web';
            if (app.get('env') === 'development') {
                res.sendFile(`${webClientUrl}/index.html`, { root });
            }

            if (app.get('env') !== 'development') {
                const lang = req.headers['lang'];
                if (lang === 'af-ZA') {
                    res.sendFile(`${webClientUrl}/af-ZA/index.html`, { root });
                } else if (lang === 'en-US') {
                    res.sendFile(`${webClientUrl}/en-US/index.html`, { root });
                } else {
                    res.sendFile(`${webClientUrl}/index.html`, { root });
                }
            }
        });
    }

    public setupGraphQL(app: express.Application): void {
        // const schema = makeExecutableSchema({
        //     typeDefs,
        //     resolvers
        // });

        // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

        // app.use('/graphiql', graphiqlExpress({
        //     endpointURL: '/graphql',
        // }));
    }

    public setupErrors(app: express.Application): void {
        app.use(ApiError.NotFoundError);

        if (app.get('env') === 'development') {
            app.use(ApiError.InternalServerErrorDev);
        }

        app.use(ApiError.InternalServerErrorProd);
    }

    public setupDatabase(app: express.Application): void {
        app.use(Neo4j.sessionCleanup);
    }

    public setupCors(app: express.Application): void {
        app.use((req: Request | any, res: Response, next: NextFunction) => {
            const allowedOrigins = app.get('env') === 'development'
                ? ['http://localhost:4200' /*Dev web client*/, 'http://localhost:3000' /*Web client*/, 'http://localhost:8000' /*IOS client*/, 'http://10.0.0.10:3000' /*Phone client*/]
                : ['https://nean-starter.azurewebsites.net'];
            const origin = req.headers.origin;
            if (allowedOrigins.indexOf(origin) > -1) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }

            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }
}
