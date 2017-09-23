// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrlEndpoint: 'http://localhost:3000',
  googleAnalytics: {
    web: 'UA-102909242-5',
    ios: 'UA-102909242-6',
    chromeExtension: 'UA-102909242-7'
  },
  hostUrlForSharingToWeb: 'http://localhost:3000'
};
