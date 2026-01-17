const { defineConfig } = require('cypress');

// Node version specified in .nvmrc: 24.12.0
// Cypress version: 15.8.2

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:4300',
    apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    videoCompression: 32,
    viewportWidth: 390,
    viewportHeight: 844,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    watchForFileChanges: true,
    chromeWebSecurity: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:8080',
      // Add other environment variables here
      adminUsername: process.env.CYPRESS_ADMIN_USERNAME || 'admin',
      adminPassword: process.env.CYPRESS_ADMIN_PASSWORD || 'admin',
    },
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});

