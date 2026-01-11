Cypress.Commands.add('loginTestUser', () => {
    // TODO get from env
    cy.visit('/login/test-user');
});