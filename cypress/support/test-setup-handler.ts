import {InformationSetupHandler} from "./information/information-setup.handler";

export const USER_ONE_TOKEN_KEY = "testUserOneToken";

export class TestSetupHandler {

    private informationSetupHandler: InformationSetupHandler;

    private backendUrl: string;

    private adminToken?: string;

    private adminJwt?: string;

    constructor() {
        this.backendUrl = Cypress.env('apiUrl');
        this.informationSetupHandler = new InformationSetupHandler(this.backendUrl);
    }

    setUp(): void {
        this.createTestAdmin()
            .then(() => this.loginAdminUser())
            .then(() => this.createTestUser())
            .then(() => this.informationSetupHandler.setUp(this.adminJwt!));
    }

    private createTestAdmin(): Cypress.Chainable<Cypress.Response<any>> {
        return cy.request('POST', `${this.backendUrl}/test-data/find-or-create-test-admin`)
            .then((response) => {
                expect(response.status).to.eq(200);
                this.adminToken = response.body;
            });
    }

    private loginAdminUser() {
        return cy.request({
            method: 'POST',
            url: `${this.backendUrl}/auth/login`,
            body: {
                token: this.adminToken!
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            this.adminJwt = response.body.jwt;
        });
    }

    private createTestUser(): Cypress.Chainable<any> {
        const bearer = this.adminJwt!;
        return cy.request({
            method: 'POST',
            url: `${this.backendUrl}/guest/find-or-create?guestName=TestUserOne&isAdmin=false`,
            auth: {
                bearer: bearer
            }
        }).then((response) => this.storeToken(USER_ONE_TOKEN_KEY, response));
    }

    private storeToken(tokenKey: string, response: Cypress.Response<any>) {
        expect(response.status).to.eq(200);
        cy.log('Storing token for', tokenKey, ':', JSON.stringify(response.body));
        const token: string = response.body;
        Cypress.env(tokenKey, token);
    }
}
