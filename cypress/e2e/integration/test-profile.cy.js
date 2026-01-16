const FILE_INPUT_BUTTON_SELECTOR = `app-file-input-button.file-input-button--overlay`;
describe('Integration Tests - Test User Profile Image Upload', () => {

    beforeEach(() => {
        cy.loginTestUser();
    });

    it('upload profile picture works', () => {
        cy.get('.bottom-nav > :nth-child(5)').click()
        cy.get(`${FILE_INPUT_BUTTON_SELECTOR} svg`).click();
        cy.get(`${FILE_INPUT_BUTTON_SELECTOR} input`).selectFile('test-data/test-upload.jpg', {force: true});

        cy.get('app-reload-spinner').should('not.exist');
    });
})