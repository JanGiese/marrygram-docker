/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login test user with token
     */
    loginTestUser(): Chainable<void>;
  }

  interface EnvironmentVariables {
    apiUrl: string;
    testAdminToken: string;
    adminUsername: string;
    adminPassword: string;
  }
}
