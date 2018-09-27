import * as bodyParser from 'body-parser';
import { Application } from 'express';
// import * as cors from 'cors';
// import * as morgan from 'morgan';
import * as helmet from 'helmet';
// import * as compression from 'compression';

class AppConfig {
    configure(app: Application): void {

        app
            // Enabling the cors headers
            // .options('*', cors())
            // .use(cors())

            // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
            .use(helmet())
            // .use(helmet.noCache())
            // .use(helmet.hsts({
            //     maxAge: 31536000,
            //     includeSubdomains: true
            // }))

            // Compress response bodies for all request that traverse through the middleware
            // .use(compression())

            // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        // HTTP request logger middleware for node.js
        // .use(morgan('dev'));
    }
}

export const appConfig = new AppConfig();
