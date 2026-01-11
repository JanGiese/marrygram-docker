const APP_FILE_INPUT_BUTTON = 'app-file-input-button:nth-child(1)';

describe('Integration Tests - Test User media flow', () => {
    const testTitle = 'Upload Integration Test';
    const updatedTitle = 'Edited Title';
    const testUserName = 'Test User';

    beforeEach(() => {
        cy.loginTestUser();
    });

    it('upload works', () => {
        let fileInputApp = cy.get(APP_FILE_INPUT_BUTTON);
        fileInputApp.should('exist');
        let fileInput = cy.get(`${APP_FILE_INPUT_BUTTON} input`);

        fileInput.should('exist');

        fileInput.should('not.be.visible');

        cy.get(`${APP_FILE_INPUT_BUTTON} svg`).click();
        fileInput.selectFile('test-data/test-upload.jpg', {force: true});
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
    })


    it('edit title works', () => {
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

    it('edit cancel works', () => {
        const editTestMediaBlock = getMediaBlockByTitle(updatedTitle);
        editTestMediaBlock
            .within(() => {
                cy.get('.action-row > .action-buttons > .edit-btn svg').click();
            });

        const cancelledTitle = 'Edited Title That Should Not Be Saved';
        inputTitle(cancelledTitle);
        const cancelButton = getCancelButton();
        cancelButton.click();

        getMediaBlockByTitle(updatedTitle)
            .should('exist');
    });


    it('delete works', () => {
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

    function getEditButton() {
        return cy.get(':nth-child(1) > .media-block > .action-row > .action-buttons > .edit-btn');
    }

    function getReloadSpinner(mediaItemIndex) {
        return cy.get(`:nth-child(${mediaItemIndex}) > .media-block > .media-item > app-reload-spinner > .spinner`);
    }

    function getMediaBlockByIndex(mediaItemIndex) {
        return cy.get(`:nth-child(${mediaItemIndex}) > .media-block > .media-item`);
    }

    function getMediaBlockByTitle(title) {
        return cy.get('.media-block')
            .contains(title)
            .parent().parent();
    }

    function inputTitle(testTitle) {
        const input = cy.get('input[type="text"]');
        input.click();
        input.clear();
        input.type(testTitle);
    }

    function clickSubmit() {
        cy.get('button.btn-primary').click();
    }

    function getConfirmDeleteButton() {
        return cy.get('.confirm-dialog > .actions > .btn-danger');
    }

    function getCancelButton() {
        return cy.get('button.btn-secondary');
    }
})