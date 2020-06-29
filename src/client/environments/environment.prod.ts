const domain = 'nean.io';

export const environment = {
  production: true,
  serverEndpoint: `https://${domain}`,
  webSocketEndpoint: `wss://${domain}/api/`,
  analyticsServerEndpoint: `https://${domain}/analytics`,
  analytics: {
    web: '50c3fc5726ae566b592957720b71493cbfb485e4',
    ios: '50c3fc5726ae566b592957720b71493cbfb485e4',
    chromeExtension: '50c3fc5726ae566b592957720b71493cbfb485e4'
  },
  firebase: {
    projectId: 'nean-181415',
    storageBucket: 'gs://nean-181415.appspot.com/',
    messagingSenderId: '622256376084'
  },
  stripe: {
    publishableKey: 'pk_live_d2ZlfgXFkSdjFPp9Y2UbEgyP'
  },
  publicVapidKey: 'BMUIhFZbE73WwegOXVm1Bj1dI1yMvz2ywBr4oEPqCijImFJ3kyef0W-KQ4wf0v_hcc5GPZfYbYsFoWYU2_QQ9Hw'
};
