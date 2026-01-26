import {USER_ONE_TOKEN} from './test-setup-handler';

Cypress.Commands.add('loginTestUser', (): void => {
    cy.intercept({method: 'POST', url: '/auth/*'}).as('auth');
    cy.visit(`/login/${USER_ONE_TOKEN}`);
    cy.wait('@auth');
});