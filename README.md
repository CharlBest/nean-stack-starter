# Nean (Neo4j, Express, Angular, Node) Stack Starter

A basic app that has all the features that all platfroms have like authentication, validation, error handling and more.

## [DEMO](http://nean.io/)

Similar to the MEAN stack just with Neo4j rather than Mongo.

* Angular (client), Node (API), Neo4j (database)
* Nodejs in Typescript
* Basic Webpack build for Node (API)
* Angular CLI
* Chrome extension build output
* JWT (JSON web token) authentication
* Password hashing + salt
* SendGrid Email integration
* Angular Material
* Neo4j query integration
* API arcitecture (route -> controller -> service -> repository)
* Shared validation between Angular and Node (Error handling)
* Shared strongly typed view models
* Shared strongly typed API endpoints
* Google analytics - automatic page tracking
* Client share actions

Client pages

    * sign up
    * login
    * forgot password/reset password
    * header navigation
    * newsletter sign up
    * email feedback
    * profile
    * tutorials
    * verify email

## In-progress or comming soon
* Media (blob) storage upload (Azure)
* Progressive Web App (PWA)
* Stripe Payment integrations
* Angular localization
* GraphQL integration (Apollo)
* Cordova IOS build output
* Unit + integration tests (Karma + Protractor)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/), [Neo4j](https://neo4j.com/) and [Angular CLI](https://cli.angular.io/) installed.

```sh
$ git clone git@github.com:CharlBest/nean-stack-starter.git
$ cd nean-stack-starter
$ npm install
$ npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/)

## Watch (hot reload)
```sh
$ npm run dev
```

## Procfile
This file is [Heroku](https://www.heroku.com/) specific for hosting the [nean demo app](https://www.nean.io/). Delete it if your are not using Heroku

## Environment variables
### Client
In the environments folder there are 2 files. one for dev and one for production. The angular CLI switches them at build time.
### Server
In the root there is a .env file. At development webpack includes these at build time in your output