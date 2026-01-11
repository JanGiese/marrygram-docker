import './commands';
import 'cypress-wait-until';

before(() => {
    cy.log('Starting E2E Test Suite');
});

after(() => {
    cy.log('E2E Test Suite Completed');
});

beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
});

afterEach(function () {
    if (this.currentTest.state === 'failed') {
        cy.log(`Test "${this.currentTest.title}" failed`);
    }
});

Cypress.on('uncaught:exception', (err, _runnable) => {
    console.error('Uncaught exception:', err);
    return false;
});

