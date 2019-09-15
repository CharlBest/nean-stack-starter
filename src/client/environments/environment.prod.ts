const domain = 'nean.io';

export const environment = {
  production: true,
  serverEndpoint: `https://${domain}`,
  webSocketEndpoint: `wss://${domain}`,
  analyticsServerEndpoint: `https://${domain}/analytics`,
  analytics: {
    web: '52130482aec0422c8d4cc0a04a7d16237c8433ed',
    ios: '52130482aec0422c8d4cc0a04a7d16237c8433ed',
    chromeExtension: '52130482aec0422c8d4cc0a04a7d16237c8433ed'
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
