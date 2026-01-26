export const USER_ONE_TOKEN = 'fe1a7a32-b262-419c-bef0-938c61363adf';

const TEST_DATA_ZIP = 'export-with-images.zip';

export class TestSetupHandler {

    private backendUrl: string;

    private textDecoder: TextDecoder;

    constructor() {
        this.backendUrl = Cypress.env('apiUrl');
        this.textDecoder = new TextDecoder();
    }

    setUp(): void {
        this.importTestData();
    }

    private importTestData(): void {
        cy.fixture(TEST_DATA_ZIP, 'binary').then((zipFileContent) => {
            const blob = Cypress.Blob.binaryStringToBlob(zipFileContent);
            const formData = new FormData();
            formData.append('file', blob, TEST_DATA_ZIP);

            cy.request({
                method: 'POST',
                url: `${this.backendUrl}/import/zip`,
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                encoding: 'utf8'
            }).then((response) => this.verifyUploadResponse(response));
        });
    }

    private verifyUploadResponse(response: Cypress.Response<any>) {
        expect(response.status).to.eq(200);

        this.textDecoder = new TextDecoder();
        const responseText = this.textDecoder.decode(response.body as ArrayBuffer);
        const responseJson = JSON.parse(responseText);

        expect(responseJson.success).to.be.true;
        expect(responseJson.message).to.contain('imported successfully');
        expect(responseJson.recordCounts).to.exist;
        expect(responseJson.imagesCounts).to.exist;
    }
}