// TODO: maybe add cors if own implementation isn't sufficient
// import * as cors from 'cors';
import * as compression from 'compression';
import * as express from 'express';
import { Application } from 'express';
import * as helmet from 'helmet';

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
            .use(compression())
            // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
            .use(express.json({
                // Controls the maximum request body size
                limit: '80kb'
            }))
            .use(express.urlencoded({
                // The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false)
                // or the qs library (when true). The "extended" syntax allows for rich objects and arrays to be encoded into the
                // URL-encoded format, allowing for a JSON-like experience with URL-encoded.
                extended: true
            }));

        // HTTP request logger middleware for node.js
        // .use(morgan('dev'));
    }
}

export const appConfig = new AppConfig();
