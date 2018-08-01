import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as http from 'http';
import * as path from 'path';
import * as webSocket from 'ws';
import { GeneralRoutes } from '../app/general/general.routes';
import { PaymentsRoutes } from '../app/payments/payments.routes';
import { UsersRoutes } from '../app/users/users.routes';
import { environment } from '../environments/environment';
import { Database } from './database';
import { ApiError } from './middleware/api-error';
import { Authentication } from './middleware/authentication';
import { Neo4j } from './middleware/neo4j';
import { WebSocketServer } from './middleware/web-socket-server';
import { Server } from './server';

const root = './';

export class Bootstrap {

    public defineExpressApp(app: express.Application) {
        app.set('port', process.env.PORT || Server.normalizePort(environment.port));
    }

    public startServer(app: express.Application): http.Server {
        return app.listen(app.get('port'));
    }

    public setupCoreTools(app: express.Application): void {
        // const swaggerUI = new SwaggerUI();
        // swaggerUI.setup(app);
    }

    public setupAuthentication(app: express.Application): void {
        app.use(Authentication.setAuthUser);
    }

    public setupRoutes(app: express.Application): void {
        app.use(express.static(path.join(root, 'dist/nean-stack-starter')));

        // serving api routes
        const generalRouter = new GeneralRoutes().router;
        const usersRouter = new UsersRoutes().router;
        const paymentsRouter = new PaymentsRoutes().router;

        app.use('/api', generalRouter);
        app.use('/api', usersRouter);
        app.use('/api', paymentsRouter);

        // Not sure if this is the best way of doing it
        // This is to serve web app sub routes
        app.get('*', (req, res) => {
            const webClientUrl = 'dist/nean-stack-starter';
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

    public setupWebSockets(server: http.Server): void {
        const wss = WebSocketServer.getSocketServer(server);

        wss.on('connection', (ws, req) => {
            // const location = url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

            ws.on('message', data => {
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === webSocket.OPEN) {
                        client.send(data);
                    }
                });
            });

            (<any>ws).isAlive = true;
            ws.on('pong', () => {
                (<any>ws).isAlive = true;
            });

            // ws.send('something');
        });

        //#region heartbeat

        // const interval = setInterval(function ping() {
        //     wss.clients.forEach((client: any) => {
        //         if (client.isAlive === false) {
        //             return client.terminate();
        //         }

        //         client.isAlive = false;
        //         client.ping('', false);
        //     });
        // }, 30000);

        //#endregion
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
        } else if (app.get('env') === 'production') {
            app.use(ApiError.InternalServerErrorProd);
        }
    }

    public setupDatabase(app: express.Application): void {
        // Retrieve all queries
        // TODO: not sure if .then is wrong because queries is empty until then (should be await)
        Database.retrieveQueries().then(queries => {
            app.locals.dbQueries = queries;
        });

        app.use(Neo4j.setNeo4jSession);

        app.use(Neo4j.sessionCleanup);
    }

    public setupCors(app: express.Application): void {
        app.use((req: Request | any, res: Response, next: NextFunction) => {
            // TODO: don't think this is working
            const allowedOrigins = app.get('env') === 'development'
                ? ['http://localhost:4200' /*Dev web client*/, 'http://localhost:3000' /*Web client*/, 'http://localhost:8000' /*IOS client*/, 'http://10.0.0.10:3000' /*Phone client*/]
                : ['https://nean.io'];
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

    public setupHerokuPing(app: express.Application): void {
        if (app.get('env') !== 'development') {
            setInterval(function () {
                http.get('http://nean.io');
            }, 1740000);
        }
    }
}
