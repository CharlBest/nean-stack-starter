// TODO: maybe add cors if own implementation isn't sufficient
// import * as cors from 'cors';
import * as compression from 'compression';
import * as express from 'express';
import { Application } from 'express';
import * as helmet from 'helmet';

class Middleware {
    configure(app: Application): void {

        app
            // Enabling the cors headers
            // .options('*', cors())
            // .use(cors())

            // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
            .use(helmet())
            .use(helmet.hidePoweredBy({ setTo: 'PHP/5.4.0' }))
            .use(helmet.referrerPolicy({ policy: 'no-referrer' }))
            // .use(helmet.hsts({
            //     maxAge: 31536000,
            //     includeSubdomains: true
            // }))

            // Compress response bodies for all request that traverse through the middleware
            .use(compression())
            .use(express.urlencoded({
                // The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false)
                // or the qs library (when true). The "extended" syntax allows for rich objects and arrays to be encoded into the
                // URL-encoded format, allowing for a JSON-like experience with URL-encoded.
                extended: true,
                limit: '400kb'
            }));

        // HTTP request logger middleware for node.js
        // .use(morgan('dev'));

        // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
        app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            // TODO: this will execute on every request. Maybe code can be optimized
            const urlsToNotParse = ['stripeWebook'];
            const skipParse = urlsToNotParse.some(url => req.originalUrl.endsWith(url));

            if (skipParse) {
                next();
            } else {
                express.json({
                    // Controls the maximum request body size
                    limit: '80kb'
                })(req, res, next);
            }
        });
    }

}

export const middleware = new Middleware();
