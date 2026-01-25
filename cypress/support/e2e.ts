/// <reference types="cypress" />

import './commands';
import {TestSetupHandler} from './test-setup-handler';
import 'cypress-wait-until';

before((): void => {
    cy.log('Starting E2E Test Suite');
    const testSetupHandler = new TestSetupHandler();
    testSetupHandler.setUp();
});

after((): void => {
    cy.log('E2E Test Suite Completed');
});

beforeEach((): void => {
    cy.clearCookies();
    cy.clearLocalStorage();
});

afterEach(function (this: Mocha.Context): void {
    if (this.currentTest?.state === 'failed') {
        cy.log(`Test "${this.currentTest.title}" failed`);
    }
});

Cypress.on('uncaught:exception', (err: Error, _runnable: Mocha.Runnable): boolean => {
    console.error('Uncaught exception:', err);
    return false;
});
