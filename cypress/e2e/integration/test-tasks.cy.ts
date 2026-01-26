/// <reference types="cypress" />

function navigateToTasks(): void {
    cy.get('nav.bottom-nav button:nth-child(2)').click();
}


describe('Integration Tests - Tasks', (): void => {

    beforeEach((): void => {
        cy.loginTestUser();
        cy.reload();
        navigateToTasks();
    });

    it('can navigate', (): void => {
        cy.get('nav.bottom-nav button:nth-child(2)').should('have.class', 'is-active');
        cy.get('.tasks-container').should('be.visible');
    });

    it('can add, expand and remove tasks', (): void => {
        addAndVerifyTasks();
        expandVerifyAndRemoveTasks();
        expandVerifyAndRemoveTasks();
    });

    it('can complete and uncomplete task', (): void => {
        cy.get('button.add-task-btn').click();
        cy.get('app-task-page app-file-input-button input').selectFile('cypress/fixtures/test-upload.jpg', {force: true});
        cy.get('button.btn-primary').click();
        cy.get('app-task-page app-file-input-button').should('not.exist');
        cy.get('div.task-header').click();
        cy.get('.media-item > img').should('exist');
        
        cy.get('path[d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm14.71-9.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"]').click();
        cy.get('button.btn-danger').click();
        cy.get('div.confirm-dialog button.btn-danger').click();
        cy.get('app-task-page app-file-input-button').should('exist');
        
        
        cy.get('h3').click();
        cy.get('button.delete-btn').click();
    });

    function addAndVerifyTasks() {
        cy.get('button.add-task-btn').click();
        cy.get('button.add-task-btn').click();

        cy.get(':nth-child(1) > .task-page > .task-header').should('exist');
        cy.get(':nth-child(2) > .task-page > .task-header').should('exist');
        cy.get('button.add-task-btn').should('not.exist');
    }

    function expandVerifyAndRemoveTasks() {
        cy.get('app-task-page:nth-child(1)').click();
        cy.get(':nth-child(1) > .task-page > .task-content > .task-description').should('exist');
        cy.get('button.delete-btn').click();
    }
});
