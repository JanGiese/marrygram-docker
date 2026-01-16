/**
 * Integration Tests - Complete User Flows
 */

describe('Integration Tests - Test User Login flow', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('Logged out - should display login', () => {
    cy.get('#guestLoginTitle').should('exist');
  });

  it('Logged in - should not display login', () => {
    cy.loginTestUser();

    cy.get('#guestLoginTitle').should('not.exist');
  });

});

