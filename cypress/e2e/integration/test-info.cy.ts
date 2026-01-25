/// <reference types="cypress" />

function navigateToInformation(): void {
    cy.get('button:nth-child(4) svg').click();
}

function expandInfofoSection(selector: number): void {
    cy.get('div:nth-child(' + selector + ') > div.info-header > span.expand-icon').click();
}

describe('Integration Tests - Information', (): void => {

    beforeEach((): void => {
        cy.loginTestUser();
        cy.reload();
    });

    it('can navigate', (): void => {
        navigateToInformation();
        cy.get('button:nth-child(4) svg').click();
    });

    it('can see information', (): void => {
        navigateToInformation();
        cy.get('.info-container').should('be.visible');
    });

    it('can expand and collapse sections', (): void => {
        navigateToInformation();

        // Test expanding sections
        expandInfofoSection(1);
        cy.get('div:nth-child(1) .info-content').should('be.visible');

        expandInfofoSection(2);
        cy.get('div:nth-child(2) .info-content').should('be.visible');

        // Test collapsing sections
        expandInfofoSection(1);
        cy.get('div:nth-child(1) .info-content').should('not.be.visible');
    });

    it('can verify content visibility', (): void => {
        navigateToInformation();
        cy.get('.info-header').should('be.visible');
        cy.contains('Information').should('be.visible');
    });
});
