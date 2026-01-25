import {USER_ONE_TOKEN_KEY} from './test-setup-handler';

Cypress.Commands.add('loginTestUser', (): void => {
    cy.intercept({method: 'POST', url: '/auth/*'}).as('auth');
    const userToken: string = Cypress.env(USER_ONE_TOKEN_KEY);
    cy.visit(`/login/${userToken}`);
    cy.wait('@auth');
});
