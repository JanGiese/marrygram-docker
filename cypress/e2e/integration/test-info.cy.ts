const ADDRESS_SECTION_INDEX = 1;

const SCHEDULE_SECTION_INDEX = 2;

const MENU_SECTION_INDEX = 3;

const HOUSE_RULES_SECTION_INDEX = 4;

interface MenuItem {
    name: string;
    description: string;
}

describe('Integration Tests - Information', (): void => {

    beforeEach((): void => {
        cy.loginTestUser();
        cy.reload();
        navigateToInformation();
    });

    it('can navigate', (): void => {
        cy.get('nav.bottom-nav button:nth-child(4)').should('have.class', 'is-active');
    });

    it('can see information', (): void => {
        cy.get('.info-container').should('be.visible');
    });

    it('can expand and collapse address section', (): void => {
        verifyExpandAndCollapse(ADDRESS_SECTION_INDEX);
    });

    it('can expand and collapse schedule section', (): void => {
        verifyExpandAndCollapse(SCHEDULE_SECTION_INDEX);
    });

    it('can expand and collapse menu section', (): void => {
        verifyExpandAndCollapse(MENU_SECTION_INDEX);
    });

    it('can check address', (): void => {
        navigateToInformation();
        toggleInfoSection(ADDRESS_SECTION_INDEX);

        verifyAddressLine(1, '12 Apostel am Staadt Essen');
        verifyAddressLine(2, 'Ruhrtalstraße 111');
        verifyAddressLine(3, '45239 Essen');
        verifyAddressLine(4, 'Deutschland');

        verifyFontWeightGreater(1, 2);
        verifyFontWeightGreater(1, 3);
        verifyFontWeightGreater(1, 4);

        cy.get('.google').should('have.attr', 'href', 'https://maps.google.com/maps?daddr=Ruhrtalstra%C3%9Fe%20111%2C%2045239%20Essen');
        cy.get('.apple').should('have.attr', 'href', 'https://maps.apple.com/?daddr=Ruhrtalstra%C3%9Fe%20111%2C%2045239%20Essen');
    });

    it('can check schedule', (): void => {
        navigateToInformation();
        toggleInfoSection(SCHEDULE_SECTION_INDEX);

        cy.get('.first > .schedule-content > .schedule-name').contains('Beginn');
        cy.get('.first > .schedule-content > .schedule-time').contains('14:30');

        cy.get('.last > .schedule-content > .schedule-name').contains('Ende');
        cy.get('.last > .schedule-content > .schedule-time').contains('15:00');
    });

    it('can check menu', (): void => {
        navigateToInformation();
        toggleInfoSection(MENU_SECTION_INDEX);

        verifyMenuCategory(1, 'Vorspeise', [
            {name: 'Salat', description: 'Ein Salat'},
            {name: 'KP', description: 'Lorem ipsum'}
        ]);

        verifyMenuCategory(2, 'Hauptgericht', [
            {name: 'Fleisch', description: 'vom Tier'},
            {name: 'Fisch', description: 'aus dem Wasser'}
        ]);

        verifyMenuCategory(3, 'Nachtisch', [
            {name: 'Eis', description: 'ist kalt'},
            {name: 'Pfannkuchen', description: 'ist warm'}
        ]);

        verifyMenuCategory(4, 'Getränke', [
            {name: 'Wasser', description: 'ist Jesus mal drüber gelaufen'},
            {name: 'Rotwein', description: 'roter Wein'},
            {name: 'Weisswein', description: 'weisser Wein'},
            {name: 'Bier', description: 'vom Fass, bestimmt aus dem Sauerland'}
        ]);
    });

    it('can check house rules', (): void => {
        navigateToInformation();
        toggleInfoSection(HOUSE_RULES_SECTION_INDEX);
        cy.get(':nth-child(1) > .item-title').contains('Keine Wunderkerzen oder Konfetti');
        cy.get(':nth-child(1) > .item-description').contains('verzichten.');

        cy.get(':nth-child(2) > .item-title').contains('Dresscode');
        cy.get(':nth-child(2) > .item-description').contains('kleiden.');
    });

    function navigateToInformation(): void {
        cy.get('button:nth-child(4) svg').click();
    }

    function toggleInfoSection(index: number): void {
        cy.get('div:nth-child(' + index + ') > div.info-header > span.expand-icon').click();
    }

    function verifyExpandAndCollapse(index: number) {
        cy.get('div:nth-child(' + index + ') .info-content').should('not.exist');
        toggleInfoSection(index);
        cy.get('div:nth-child(' + index + ') .info-content').should('be.visible');
        toggleInfoSection(index);
        cy.get('div:nth-child(' + index + ') .info-content').should('not.exist');
    }

    function verifyAddressLine(index: number, content: string) {
        cy.get('.address-details > :nth-child(' + index + ')').should(($addressLine) => {
            expect($addressLine).to.contain(content);
        });
    }

    function verifyFontWeightGreater(index: number, indexToCompare: number) {
        cy.get('.address-details > :nth-child(' + index + ')')
            .invoke('css', 'font-weight')
            .then((fontWeight) => +fontWeight)
            .then(weight1 => {
                cy.get('.address-details > :nth-child(' + indexToCompare + ')')
                    .invoke('css', 'font-weight')
                    .then((fontWeight) => +fontWeight)
                    .then(weight2 => {
                        expect(weight1).to.be.greaterThan(weight2);
                    });
            });
    }

    function verifyMenuCategory(categoryIndex: number, categoryTitle: string, menuItems: MenuItem[]) {
        cy.get(':nth-child(' + categoryIndex + ') > .menu-category > .category-title').contains(categoryTitle);

        for (let menuItemIndex = 1; menuItemIndex <= menuItems.length; menuItemIndex++) {
            const menuItem = menuItems[menuItemIndex - 1];
            cy.get(':nth-child(' + categoryIndex + ') > .menu-category > .menu-items > :nth-child(' + menuItemIndex + ') > .item-name').contains(menuItem.name);
            cy.get(':nth-child(' + categoryIndex + ') > .menu-category > .menu-items > :nth-child(' + menuItemIndex + ') > .item-description').contains(menuItem.description);
        }
    }
});
