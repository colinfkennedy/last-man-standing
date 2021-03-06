'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'last-man-standing',
    environment,
    rootURL: '/',
    locationType: 'none',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      applicationId: 'n3mP3kHO2C683mycrV7dnyKeqaE8WH31IJtE8yEc',
      restClientKey: 'JuHDw0dNg7DFiYkwZgeBCXy1kZSllyxpotYWx3cs',
      javascriptClientKey: 'NXIcBhTGhbMegFfrorRm8aAnZm71NLzWYTtC9Uk6',
      parseServerUrl: 'https://parseapi.back4app.com',
      firebaseApiKey: 'AIzaSyCgM942_PC0wp1LQ9tM8WghJ34YAX-2O8Q',
      firebaseProjectId: 'babb-last-man-standing',
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
