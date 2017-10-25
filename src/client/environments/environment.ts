// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  webSocketUrlEndpoint: 'ws://localhost:3000/',
  apiUrlEndpoint: 'http://localhost:3000',
  googleAnalytics: {
    web: 'UA-107304143-1',
    ios: 'UA-102909242-6',
    chromeExtension: 'UA-102909242-7'
  },
  hostUrlForSharingToWeb: 'http://localhost:3000',
  firebase: {
    apiKey: '***',
    authDomain: 'nean-dev.firebaseapp.com',
    databaseURL: 'https://nean-dev.firebaseio.com',
    projectId: 'nean-dev',
    storageBucket: 'gs://nean-dev.appspot.com/',
    messagingSenderId: '***'
  },
  stripe: {
    publishableKey: 'pk_test_LjqROoizWX5XWMeFFFDPC4ST'
  }
};
