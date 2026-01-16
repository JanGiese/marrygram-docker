Cypress.Commands.add('loginTestUser', () => {
    // TODO get from env
    cy.intercept({method: 'POST', url:'/auth/*'}).as('auth')
    cy.visit('/login/test-user');
    cy.wait('@auth');
});