import { Application, NextFunction, Request, Response } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { SocketDataModel } from '../../shared/models/web-socket/socket-data.model';
import { generalRoutes } from '../app/general/general.routes';
import { itemsRoutes } from '../app/items/items.routes';
import { notificationsRoutes } from '../app/notifications/notifications.routes';
import { paymentsRoutes } from '../app/payments/payments.routes';
import { usersRoutes } from '../app/users/users.routes';
import { broker } from '../broker/broker';
import { environment } from '../environments/environment';
import { Database } from './database';
import { ApiError } from './middleware/api-error';
import { Authentication } from './middleware/authentication';
import { Neo4j } from './middleware/neo4j';
import { webSocketServer } from './middleware/web-socket-server';
import { Server } from './server';
import { dataFetcher } from './utils/data-fetcher';

const root = './';

class Bootstrap {

    defineExpressApp(app: Application) {
        app.set('port', Server.normalizePort(environment.port));
    }

    startServer(app: Application): http.Server {
        return app.listen(app.get('port'));
    }

    setupCoreTools(app: Application): void {
        // const swaggerUI = new SwaggerUI();
        // swaggerUI.setup(app);
    }

    setupAuthentication(app: Application): void {
        app.use(Authentication.setAuthUser);
    }

    setupRoutes(app: Application): void {
        // serving api routes
        app.use('/api', generalRoutes);
        app.use('/api', usersRoutes);
        app.use('/api', paymentsRoutes);
        app.use('/api', itemsRoutes);
        app.use('/api', notificationsRoutes);
    }

    setupStaticFiles() {
        // app.use(expressStatic(path.join(root, 'dist/nean-stack-starter')));

        // Not sure if this is the best way of doing it
        // This is to serve web app sub routes
        // app.get('*', (req, res) => {
        //     const webClientUrl = 'dist/nean-stack-starter';
        //     if (app.get('env') === 'development') {
        //         res.sendFile(`${webClientUrl}/index.html`, { root });
        //     }

        //     if (app.get('env') !== 'development') {
        //         const lang = req.headers['lang'];
        //         if (lang === 'af-ZA') {
        //             res.sendFile(`${webClientUrl}/af-ZA/index.html`, { root });
        //         } else if (lang === 'en-US') {
        //             res.sendFile(`${webClientUrl}/en-US/index.html`, { root });
        //         } else {
        //             res.sendFile(`${webClientUrl}/index.html`, { root });
        //         }
        //     }
        // });
    }

    setupWebSockets(server: http.Server): void {
        const wss = webSocketServer.init(server);

        wss.on('connection', (ws: ExtendedWebSocket, req) => {
            // const location = url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

            // Keep alive
            ws.isAlive = true;
            ws.on('pong', () => {
                ws.isAlive = true;
            });

            ws.on('message', (data: SocketDataModel) => {
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(data);
                    }
                });
            });

            ws.on('error', err => {
                // console.warn(`Client disconnected - reason: ${err}`);
            });
        });

        // Heart beat
        setInterval(() => {
            wss.clients.forEach((ws: ExtendedWebSocket) => {
                if (!ws.isAlive) {
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping(() => { });
            });
        }, 30000);
    }

    setupGraphQL(app: Application): void {
        // const schema = makeExecutableSchema({
        //     typeDefs,
        //     resolvers
        // });
        // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
        // app.use('/graphiql', graphiqlExpress({
        //     endpointURL: '/graphql',
        // }));
    }

    setupErrors(app: Application): void {
        app.use(ApiError.NotFoundError);

        if (app.get('env') === 'development') {
            app.use(ApiError.InternalServerErrorDev);
        } else if (app.get('env') === 'production') {
            app.use(ApiError.InternalServerErrorProd);
        }
    }

    async setupDatabase(app: Application): Promise<void> {
        // Retrieve all queries
        await Database.getQueries();

        app.use(Neo4j.setNeo4jSession);

        app.use(Neo4j.sessionCleanup);
    }

    setupCors(app: Application): void {
        app.use((req: Request, res: Response, next: NextFunction) => {
            // TODO: don't think this is working
            const allowedOrigins = app.get('env') === 'development'
                ? [
                    'http://localhost:4200' /*Dev web client*/,
                    'http://localhost:3000' /*Web client*/,
                    'http://localhost:8000' /*IOS client*/,
                    'http://10.0.0.10:3000' /*Phone client*/
                ]
                : [
                    'https://nean.io',
                    'https://dev.nean.io',
                    'https://staging.nean.io'
                ];
            const origin = req.headers.origin as string;
            if (allowedOrigins.indexOf(origin) > -1) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }

            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }

    setupAutoPeriodicDataFetch(app: Application): void {
        if (app.get('env') !== 'development') {
            dataFetcher.init(app);
        }
    }

    setupBroker(): void {
        broker.init();
    }
}

export const bootstrap = new Bootstrap();

interface ExtendedWebSocket extends WebSocket {
    isAlive: boolean;
}
