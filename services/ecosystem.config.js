// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/

const defaultEnvironmentVariables = {
    NODE_ENV: 'production',
    NEO4J_URI: 'bolt://localhost:7687',
    NEO4J_USERNAME: 'server_web',
    NEO4J_PASSWORD: 'password',
    RABBITMQ_USERNAME: 'server_web',
    RABBITMQ_PASSWORD: 'password',
    RABBITMQ_PORT: 5672,
    STRIPE_KEY: '',
    EMAIL_USERNAME: '',
    EMAIL_PASSWORD: '',
    AUTHENTICATION_KEY: '',
    VAPID_PUBLIC_KEY: '',
    VAPID_PRIVATE_KEY: '',
};

function generate(name, customEnvironmentVariables, port = 0, instances = 1) {
    return {
        name: `nean.io_${name}`,
        script: `${name}.bundle.js`,
        cwd: `../dist/server/${name}`,
        instances: instances,
        env: {
            PORT: port,
            NEO4J_USERNAME: `server_${name}`,
            RABBITMQ_USERNAME: `server_${name}`,
            ...defaultEnvironmentVariables,
            ...customEnvironmentVariables
        },
        error_file: 'pm2-error.log',
        out_file: 'pm2-output.log',
        log_file: 'pm2-combined.log',
        restart_delay: 10000,
        max_restarts: 10,
        min_uptime: 1000
    }
}
module.exports = {
    apps: [
        generate('web', null, 3010),
        generate('worker')
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