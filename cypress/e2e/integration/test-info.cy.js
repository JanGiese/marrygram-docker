function navigateToInformation() {
    cy.get('button:nth-child(4) svg').click();
}


function expandInfofoSection(selector) {
    cy.get('div:nth-child(' + selector + ') > div.info-header > span.expand-icon').click();
}

describe('Integration Tests - Information', () => {

    beforeEach(() => {
        cy.loginTestUser();
        cy.reload();
    });

    it('can navigate', () => {
        navigateToInformation()
        cy.get('button:nth-child(4) svg').click();

        cy.get('nav.bottom-nav button:nth-child(4)').should('have.class', 'is-active')
        cy.get(':nth-child(1) > .info-header > .expand-icon').should('exist');
        cy.get(':nth-child(2) > .info-header > .expand-icon').should('exist');
        cy.get(':nth-child(3) > .info-header > .expand-icon').should('exist');
    });

    it('can check address', () => {
        navigateToInformation();
        expandInfofoSection(1);

        cy.get('.address-details > :nth-child(1)').should('exist');
        cy.get('.address-details > :nth-child(2)').should('exist');
        cy.get('.address-details > :nth-child(3)').should('exist');
        cy.get('.address-details > :nth-child(4)').should('exist');

        cy.get('a.nav-button.google')
            .should('have.attr', 'href')
            .and('include', 'Ruhrtalstra%C3%9Fe%20111%2C%2045239%20Essen');
        cy.get('a.nav-button.google').contains('Google Maps');
        cy.get('a.nav-button.apple')
            .should('have.attr', 'href')
            .and('include', 'Ruhrtalstra%C3%9Fe%20111%2C%2045239%20Essen');
        cy.get('a.nav-button.apple').contains('Apple Maps');

        cy.get('iframe[title*="Karte"]')
            .should('exist')
            .and('have.attr', 'src')
            .and('include', 'google.com/maps/embed')
            .and('include', 'Ruhrtalstra%C3%9Fe%20111');

        cy.get('iframe[title*="Karte"]')
            .should('have.attr', 'loading', 'lazy')
            .and('have.attr', 'referrerpolicy', 'no-referrer-when-downgrade')
            .and('have.attr', 'title')
            .and('include', '12 Apostel');

    });

    it('can check schedule', () => {
        navigateToInformation();
        expandInfofoSection(2);
        cy.get('.first > .schedule-content').contains('Beginn');
        cy.get('.last > .schedule-content').contains('Ende');
    });

    it('can check menu', () => {
        navigateToInformation();
        expandInfofoSection(3);
        cy.get(':nth-child(1) > .menu-category > .category-title').contains('Vorspeise');
        cy.get(':nth-child(2) > .menu-category > .category-title').contains('Hauptgericht');
        cy.get(':nth-child(3) > .menu-category > .category-title').contains('Nachtisch');
        cy.get(':nth-child(4) > .menu-category > .category-title').contains('Getränke');
        
        cy.get(':nth-child(1) > .menu-category > .menu-items > :nth-child(1) > .item-name').contains('Salat');
        cy.get(':nth-child(2) > .menu-category > .menu-items > :nth-child(1) > .item-name').contains('Fleisch');
        cy.get(':nth-child(3) > .menu-category > .menu-items > :nth-child(1) > .item-name').contains('Eis');
        cy.get(':nth-child(4) > .menu-category > .menu-items > :nth-child(1) > .item-name').contains('Wasser');

        cy.get(':nth-child(2) > .menu-category > .menu-items > :nth-child(1) > .item-description').contains('vom Tier');
    });

})