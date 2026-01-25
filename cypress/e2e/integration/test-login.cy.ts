/// <reference types="cypress" />

/**
 * Integration Tests - Complete User Flows
 */

describe('Integration Tests - Test User Login flow', (): void => {

  beforeEach((): void => {
    cy.visit('/');
  });

  it('Logged out - should display login', (): void => {
    cy.get('#guestLoginTitle').should('exist');
  });

  it('Logged in - should not display login', (): void => {
    cy.loginTestUser();
    cy.get('#guestLoginTitle').should('not.exist');
  });

  it('Should handle login token correctly', (): void => {
    cy.loginTestUser();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });

  it('Should redirect after successful login', (): void => {
    cy.loginTestUser();
    cy.location('pathname').should('eq', '/');
  });
});
