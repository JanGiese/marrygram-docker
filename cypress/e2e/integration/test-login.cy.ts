/// <reference types="cypress" />

/**
 * Integration Tests - Complete User Flows
 */

import {USER_ONE_TOKEN} from "../../support/test-setup-handler";

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

    it('Should logout correctly', (): void => {
        cy.loginTestUser();
        
        cy.get('button[aria-label="Logout"] svg').click();
        cy.get('.guest-login').should('be.visible');
        cy.location('pathname').should('include', 'login');

    });

    it('Should handle login token correctly', (): void => {
        cy.loginTestUser();
        cy.location('pathname').should('not.include', USER_ONE_TOKEN);
    });

    it('Should redirect after successful login', (): void => {
        cy.loginTestUser();
        cy.get('app-guest-logout > button').should('be.visible');
        cy.get('.bottom-nav').should('be.visible');
    });
});
