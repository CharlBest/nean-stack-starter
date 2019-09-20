const domain = 'nean.io';

export const environment = {
  production: true,
  serverEndpoint: `https://${domain}`,
  webSocketEndpoint: `wss://${domain}/api/`,
  analyticsServerEndpoint: `https://${domain}/analytics`,
  analytics: {
    web: '81552b0fe6e9ed9e024025576ada1cef02e333d1',
    ios: '81552b0fe6e9ed9e024025576ada1cef02e333d1',
    chromeExtension: '81552b0fe6e9ed9e024025576ada1cef02e333d1'
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
