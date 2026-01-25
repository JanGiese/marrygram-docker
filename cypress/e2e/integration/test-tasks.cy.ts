/// <reference types="cypress" />

function navigateToTasks(): void {
    cy.get('nav.bottom-nav button:nth-child(2)').click();
}

function expandTask(selector: number): void {
    cy.get(':nth-child(' + selector + ') > .task-page').click();
}

describe('Integration Tests - Tasks', (): void => {

    beforeEach((): void => {
        cy.loginTestUser();
        cy.reload();
    });

    it('can navigate', (): void => {
        navigateToTasks();
        cy.get('nav.bottom-nav button:nth-child(2)').should('have.class', 'is-active');
        cy.get(':nth-child(1) > .task-page > .task-header > h3').should('contain', 'Photo Task');
    });

    it('can expand a task', (): void => {
        navigateToTasks();
        expandTask(1);
        cy.get(':nth-child(1) > .task-page .task-description').should('contain', 'Take a Photo');
    });

    // TODO: Fix the upload functionality
    it('can complete photo task', (): void => {
        navigateToTasks();
        cy.get('app-task-page app-file-input-button input').selectFile('test-data/test-upload.jpg', {force: true});
        cy.get('button.btn-primary').click();
        cy.get('app-task-page app-file-input-button').should('not.exist');
        cy.get('div.task-header').click();
        cy.get('.media-item > img').should('exist');

        cy.get('path[d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm14.71-9.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"]').click();
    });

    it('can add a task', (): void => {
        navigateToTasks();
        cy.get('button.add-task-btn').click();
        cy.get(':nth-child(2) > .task-page > .task-header > h3').contains('Video Task');
        cy.get('button.add-task-btn').should('not.exist');
    });

    it('can remove a task', (): void => {
        navigateToTasks();
        expandTask(2);
        cy.get(':nth-child(2) > .task-page .delete-btn').click();
    });

    it('should display tasks container', (): void => {
        navigateToTasks();
        cy.get('app-tasks').should('be.visible');
    });

    it('should handle task interactions properly', (): void => {
        navigateToTasks();

        // Verify task elements exist
        cy.get('.task-page').should('have.length.greaterThan', 0);

        // Test task expansion/collapse
        const taskSelector: number = 1;
        expandTask(taskSelector);
        cy.get(`:nth-child(${taskSelector}) > .task-page .task-content`).should('be.visible');
    });
});
