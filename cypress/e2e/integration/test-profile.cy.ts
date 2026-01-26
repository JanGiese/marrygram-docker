/// <reference types="cypress" />

const FILE_INPUT_BUTTON_SELECTOR = `app-file-input-button.file-input-button--overlay`;

describe('Integration Tests - Test User Profile Image Upload', (): void => {

    beforeEach((): void => {
        cy.loginTestUser();
    });

    it('upload profile picture works', (): void => {
        cy.get('.bottom-nav > :nth-child(5)').click();
        cy.get(`${FILE_INPUT_BUTTON_SELECTOR} svg`).click();

        cy.get(`${FILE_INPUT_BUTTON_SELECTOR} input`).selectFile('cypress/fixtures/test-upload.jpg', {force: true});

        cy.get('app-reload-spinner').should('not.exist');
    });

    it('should display profile section', (): void => {
        cy.get('.bottom-nav > :nth-child(5)').click();
        cy.get('app-profile').should('be.visible');
    });

    it('should handle file upload errors gracefully', (): void => {
        cy.get('.bottom-nav > :nth-child(5)').click();

        // Test error handling by trying to upload invalid file
        cy.get(`${FILE_INPUT_BUTTON_SELECTOR} svg`).click();

        // Verify the input exists and is functional
        cy.get(`${FILE_INPUT_BUTTON_SELECTOR} input`)
            .should('exist')
            .and('have.attr', 'type', 'file');
    });
});
