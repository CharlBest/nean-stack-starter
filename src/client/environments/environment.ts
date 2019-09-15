// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

const domain = 'localhost:3000';

export const environment = {
  production: false,
  serverEndpoint: `http://${domain}`,
  webSocketEndpoint: `ws://${domain}`,
  analyticsServerEndpoint: 'http://localhost:32768',
  analytics: {
    web: '52130482aec0422c8d4cc0a04a7d16237c8433ed',
    ios: '52130482aec0422c8d4cc0a04a7d16237c8433ed',
    chromeExtension: '52130482aec0422c8d4cc0a04a7d16237c8433ed'
  },
  firebase: {
    projectId: 'nean-dev',
    storageBucket: 'gs://nean-dev.appspot.com/',
    messagingSenderId: '541682575310'
  },
  stripe: {
    publishableKey: 'pk_test_LjqROoizWX5XWMeFFFDPC4ST'
  },
  publicVapidKey: 'BGdpTzg0UM2ZPfhAf88qoZ3CZS1trq0oEJTS14vHbV4SYjrxBLBj2jy4DYrXzhUJ_l5t_lybFleNDWv3ZWQQVZs'
};
