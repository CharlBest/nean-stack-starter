export const environment = {
  production: true,
  domain: 'dev.nean.io',
  httpDomain: '',
  googleAnalytics: {
    web: 'UA-107304143-2',
    ios: 'UA-102909242-3',
    chromeExtension: 'UA-102909242-2'
  },
  firebase: {
    projectId: 'nean-181415',
    storageBucket: 'gs://nean-181415.appspot.com/',
    messagingSenderId: '622256376084'
  },
  stripe: {
    publishableKey: 'pk_live_ee9MNzGQ4YeBswQ2dt8p4e9k'
  },
  publicVapidKey: 'BHh0GLT09LUbnWzwX_r3YTmNMeCiDhmCO2KeT35vEcM8CW5DyfP4StRaAWviffMFY7lAK0vLoHl5h1PIubOMp10'
};

environment.httpDomain = `http${environment.production ? 's' : ''}://${environment.domain}`;
