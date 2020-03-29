// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/

const neanEnvironmentVariables = {
    APP_HOST: '',
    AUTHENTICATION_KEY: '',
    NODE_ENV: '',
    EMAIL_PASSWORD: '',
    STRIPE_KEY: '',
    VAPID_PRIVATE_KEY: '',
    VAPID_PUBLIC_KEY: '',
};
function generate(environment, server, defaultEnvironmentVariables, env, port = 0, instances = 1) {
    return {
        name: `${environment}_${server}`,
        script: `${server}.bundle.js`,
        cwd: `${environment}/dist/server/${server}`,
        instances: instances,
        env: { ...defaultEnvironmentVariables, PORT: port, ...env },
        error_file: './pm2/err.log',
        out_file: './pm2/out.log',
        log_file: './pm2/combined.log',
        restart_delay: 10000,
        max_restarts: 10,
        min_uptime: 1000
    }
}
module.exports = {
    apps: [
        generate('prod', 'web', neanEnvironmentVariables, {
            AMQP_URL: 'amqp://server_web:password@localhost:5672',
            DATABASE_PASSWORD: 'password',
            DATABASE_URI: 'bolt://localhost:7687',
            DATABASE_USERNAME: 'server_web'
        }, 3010, 1),
        generate('prod', 'worker', neanEnvironmentVariables, {
            AMQP_URL: 'amqp://server_worker:password@localhost:5672',
            DATABASE_PASSWORD: 'password',
            DATABASE_URI: 'bolt://localhost:7687',
            DATABASE_USERNAME: 'server_worker'
        })
    ],
    deploy: {
        dev: {
            host: 'localhost',
            ref: 'origin/dev',
            repo: 'https://github.com/heroku/node-js-getting-started.git',
            path: 'var/www/nean.io/deploy/dev',
            'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js'
        },
        staging: {
            host: 'localhost',
            ref: 'origin/staging',
            repo: 'https://github.com/heroku/node-js-getting-started.git',
            path: 'var/www/nean.io/deploy/staging',
            'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js'
        }
    }
};