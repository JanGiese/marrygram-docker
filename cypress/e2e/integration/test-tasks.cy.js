function navigateToTasks() {
    cy.get('nav.bottom-nav button:nth-child(2)').click();
}

function expandTask(selector) {
    cy.get(':nth-child(' + selector + ') > .task-page').click()
}

describe('Integration Tests - Tasks', () => {

    beforeEach(() => {
        cy.loginTestUser();
        cy.reload();
    });

    it('can navigate', () => {
        navigateToTasks()
        cy.get('nav.bottom-nav button:nth-child(2)').should('have.class', 'is-active')
        cy.get(':nth-child(1) > .task-page > .task-header > h3').should('contain', 'Photo Task');
    });

    it('can expand a task', () => {
        navigateToTasks()
        expandTask(1);
        cy.get(':nth-child(1) > .task-page .task-description').should('contain', 'Take a Photo')
    });

    // TODO: Fix the upload functionality
    // it('can complete photo task', () => {
    //     navigateToTasks();
    //     cy.get('app-task-page:nth-child(1) svg').click();
    //     cy.get('app-file-input-button:nth-child(1) input').selectFile('test-data/test-upload.jpg', {force: true});
    //     cy.get('button.btn-primary').click();
    // });

    it('can add a task', () => {
        navigateToTasks();

        cy.get('button.add-task-btn').click();

        cy.get(':nth-child(2) > .task-page > .task-header > h3').contains('Video Task')
        cy.get('button.add-task-btn').should('not.exist');
    });

    it('can remove a task', () => {
        navigateToTasks();
        expandTask(2);
        cy.get(':nth-child(2) > .task-page .delete-btn').click();
    });

})