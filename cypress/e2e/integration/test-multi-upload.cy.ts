/// <reference types="cypress" />


function navigateToGallery() {
    cy.get('.bottom-nav > :nth-child(1)').click();
}

describe('Integration Tests - Upload of multiple files', (): void => {
    const APP_FILE_INPUT_BUTTON: string = 'app-file-input-button:nth-child(1)';
    const testTitle: string = 'Upload Integration Test';
    const testUserName: string = 'Test User';

    beforeEach((): void => {
        cy.loginTestUser();
        navigateToGallery();
    });

    it('navigation works', (): void => {
        cy.get('nav.bottom-nav button:nth-child(1)').should('have.class', 'is-active');
    });

    it('upload works', (): void => {
        const fileInputApp = cy.get(APP_FILE_INPUT_BUTTON);
        fileInputApp.should('exist');
        const fileInput = cy.get(`${APP_FILE_INPUT_BUTTON} input`);

        fileInput.should('exist');
        fileInput.should('not.be.visible');

        cy.get(`${APP_FILE_INPUT_BUTTON} svg`).click();
        const files = ['cypress/fixtures/test-upload.jpg',
            'cypress/fixtures/test-upload-2.jpg',
            'cypress/fixtures/test-upload-3.jpg',
            'cypress/fixtures/test-upload-4.jpg',
            'cypress/fixtures/test-upload-5.jpg'];
        fileInput.selectFile(files, {force: true});

        for (let i = 1; i <= files.length; i++) {
            inputTitle(`${testTitle} ${i}`, i);
        }
        for (let i = 1; i <= files.length; i++) {
            clickSubmit(1);
        }
        for (let i = 1; i <= files.length; i++) {
            const titleIndex = files.length - i + 1;
            cy.get(`:nth-child(${i}) > .media-block > .media-info > .media-guest-name`)
                .contains(testUserName);
            cy.get(`:nth-child(${i}) > .media-block > .media-info > .media-title`)
                .contains(`${testTitle} ${titleIndex}`);
        }
    });

    function inputTitle(title: string, index: number): void {

        const input = cy.get(`app-upload-editor:nth-child(${index}) input`);
        input.click();
        input.clear();
        input.type(title);
    }

    function clickSubmit(index: number): void {
        cy.get(`:nth-child(${index}) > .simple-editor > .editor-content > .actions > .btn-primary`).click();
    }
});
