/// <reference types="cypress" />

const APP_FILE_INPUT_BUTTON: string = 'app-file-input-button:nth-child(1)';

function navigateToGallery() {
    cy.get('.bottom-nav > :nth-child(1)').click();
}

describe('Integration Tests - Test User media flow', (): void => {
    const testTitle: string = 'Upload Integration Test';
    const updatedTitle: string = 'Edited Title';
    const testUserName: string = 'Test User';

    beforeEach((): void => {
        cy.loginTestUser();
        navigateToGallery();
    });

    it ('navigation works', (): void => {
        cy.get('nav.bottom-nav button:nth-child(1)').should('have.class', 'is-active');
    });

    it('upload works', (): void => {
        const fileInputApp = cy.get(APP_FILE_INPUT_BUTTON);
        fileInputApp.should('exist');
        const fileInput = cy.get(`${APP_FILE_INPUT_BUTTON} input`);

        fileInput.should('exist');
        fileInput.should('not.be.visible');

        cy.get(`${APP_FILE_INPUT_BUTTON} svg`).click();
        fileInput.selectFile('cypress/fixtures/test-upload.jpg', {force: true});
        inputTitle(testTitle);

        clickSubmit();
        cy.get(':nth-child(1) > .media-block > .media-info > .media-guest-name')
            .contains(testUserName);
        cy.get(':nth-child(1) > .media-block > .media-info > .media-title')
            .contains(testTitle);

        getEditButton()
            .should('be.visible');
        getReloadSpinner(1)
            .should('not.exist');
        getMediaBlockByIndex(1)
            .should('not.contain', 'Kein Vorschaubild verfügbar');
    });

    it('edit title works', (): void => {
        const editTestMediaBlock = getMediaBlockByTitle(testTitle);
        editTestMediaBlock
            .within(() => {
                cy.get('.action-row > .action-buttons > .edit-btn svg').click();
            });

        inputTitle(updatedTitle);
        clickSubmit();

        getMediaBlockByTitle(updatedTitle)
            .should('exist');
    });

    it('edit cancel works', (): void => {
        const editTestMediaBlock = getMediaBlockByTitle(updatedTitle);
        editTestMediaBlock
            .within(() => {
                cy.get('.action-row > .action-buttons > .edit-btn svg').click();
            });

        const cancelledTitle: string = 'Edited Title That Should Not Be Saved';
        inputTitle(cancelledTitle);
        const cancelButton = getCancelButton();
        cancelButton.click();

        getMediaBlockByTitle(updatedTitle)
            .should('exist');
    });

    it('toggle like works', (): void => {
        const toggleLikeTestMediaBlock = getMediaBlockByTitle(updatedTitle);

        toggleLikeTestMediaBlock.dblclick();
        toggleLikeTestMediaBlock.get('.action-row > .like-info > .heart-inline')
            .should('have.class', 'is-liked');
        toggleLikeTestMediaBlock.get('.action-row > .like-info > .heart-inline > .likes-count')
            .contains('1');

        toggleLikeTestMediaBlock.dblclick();
        toggleLikeTestMediaBlock.get('.action-row > .like-info > .heart-inline')
            .should('not.have.class', 'is-liked');
        toggleLikeTestMediaBlock.get('.action-row > .like-info > .heart-inline > .likes-count')
            .contains('0');
    });

    it('delete works', (): void => {
        const deleteTestMediaBlock = getMediaBlockByTitle(updatedTitle);
        deleteTestMediaBlock
            .within(() => {
                cy.get('.action-row > .action-buttons > .edit-btn svg').click();
            });

        const deleteButton = cy.get('.btn-danger');
        deleteButton.click();

        const confirmationDialog = cy.get('.confirm-dialog');
        confirmationDialog.should('exist');

        getConfirmDeleteButton().should('exist');

        const cancelButton = cy.get('.confirm-dialog > .actions > :nth-child(2)');
        cancelButton.should('exist');
        cancelButton.click();
        confirmationDialog.should('not.exist');

        deleteButton.click();
        getConfirmDeleteButton().click();

        deleteTestMediaBlock
            .should('not.exist');
    });

    it('multi upload works', (): void => {
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

    it('paging works', (): void => {
        cy.get('.media-block').should('have.length', 5);
        cy.scrollTo('bottom');
        cy.get('.media-block').should('have.length.at.least', 6);
    });

    // Helper functions with proper TypeScript typing
    function getEditButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(':nth-child(1) > .media-block > .action-row > .action-buttons > .edit-btn');
    }

    function getReloadSpinner(mediaItemIndex: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`:nth-child(${mediaItemIndex}) > .media-block > .media-item > app-reload-spinner > .spinner`);
    }

    function getMediaBlockByIndex(mediaItemIndex: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`:nth-child(${mediaItemIndex}) > .media-block > .media-item`);
    }

    function getMediaBlockByTitle(title: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.media-block')
            .contains(title)
            .parent().parent();
    }

    function inputTitle(title: string, index: number = 1): void {
        const input = cy.get(`app-upload-editor:nth-child(${index}) input`);
        input.click();
        input.clear();
        input.type(title);
    }

    function clickSubmit(index: number = 1): void {
        cy.get(`:nth-child(${index}) > .simple-editor > .editor-content > .actions > .btn-primary`).click();
    }

    function getConfirmDeleteButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.confirm-dialog > .actions > .btn-danger');
    }

    function getCancelButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button.btn-secondary');
    }
});
