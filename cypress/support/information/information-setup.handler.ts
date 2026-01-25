export class InformationSetupHandler {

    constructor(private backendUrl: string) {
    }

    setUp(adminJwt: string): void {
        this.createTaskTemplates(adminJwt)
            .then(() => this.createTaskForGuest())
    }

    private createTaskTemplates(adminJwt: string): Cypress.Chainable<Cypress.Response<any>> {
        return this.createTaskTemplate(adminJwt, 'Photo Task', 'Take a Photo of the Venue')
            .then(() => this.createTaskTemplate(adminJwt, 'Video Task', 'Record a short video message'));
    }

    private createTaskTemplate(adminJwt: string, title: string, description: string): Cypress.Chainable<Cypress.Response<any>> {
        const body = {
            title: title,
            description: description,
            active: true
        };
        const url = `${this.backendUrl}/task-template/find-or-create`;
        return this.performRequest(adminJwt, url, body).then((response) => {
            expect(response.status).to.eq(200);
        });
    }

    private performRequest(adminJwt: string, url: string, body: any, method: string = 'POST') {
        return cy.request({
            method: method,
            auth: {
                bearer: adminJwt
            },
            url: url,
            body: body
        });
    }

    private createTaskForGuest() {
        const url = `${this.backendUrl}/task/assign-to-guest?guestName=TestUserOne`;
    }
}