// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/

const apiConfig = require('./environment.api');
const workerConfig = require('./environment.worker');

function generateDev(name, environmentVariables, instances = 1) {
    return {
        name,
        script: `${name}.bundle.js`,
        cwd: `dist/server/${name}`,
        instances,
        env: {
            NODE_ENV: 'development',
            ...environmentVariables
            // DEBUG: '*'
        },
        error_file: 'pm2-error.log',
        out_file: 'pm2-output.log',
        log_file: 'pm2-combined.log',
        watch: true,
        watch_delay: 3000,
        ignore_watch: ['*.log'],
        restart_delay: 5000
    }
}

function generateProd(name, environmentVariables, instances = 1) {
    return {
        name,
        script: `${name}.bundle.js`,
        cwd: `../dist/server/${name}`,
        instances,
        env: {
            NODE_ENV: 'production',
            ...environmentVariables
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
        generateDev('api', apiConfig),
        generateDev('worker', workerConfig)
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