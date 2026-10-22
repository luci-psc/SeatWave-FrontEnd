const FUTURE_DATE = '2027-08-15';

const selectFirstOption = (selector) => {
    cy.get(selector)
        .find('option:not([disabled])')
        .should('have.length.at.least', 1)
        .first()
        .invoke('val')
        .then(val => cy.get(selector).select(val));
};

const firstCard = () =>
    cy.get('.concert-container:not(:has(.concert-container))').first();

describe('Concerts CRUD', () => {

    describe('Read', () => {
        it('shows the concerts list without logging in', () => {
            cy.visit('/concerts');
            cy.get('.concert-grid').should('exist');
        });

        it('shows concert details when a card is visible', () => {
            cy.visit('/concerts');
            firstCard().within(() => {
                cy.get('h1').should('not.be.empty');
                cy.contains('Tickets Left').should('exist');
            });
        });
    });

    describe('Create', () => {
        beforeEach(() => cy.loginAsAdmin());

        it('admin can navigate to the create form', () => {
            cy.visit('/concerts/add');
            cy.get('h1').should('contain', 'Add New Concert');
        });

        it('creates a concert and redirects to admin dashboard', () => {
            cy.visit('/concerts/add');

            cy.get('input[type="text"]').first().type('Cypress Test Concert');
            selectFirstOption('select:eq(0)');
            cy.get('input[type="date"]').type(FUTURE_DATE);
            cy.get('input[type="time"]').type('20:00');
            cy.get('textarea').type('Created by Cypress E2E test');
            cy.get('input[placeholder="Price in €"]').type('25');
            cy.get('input[placeholder="e.g. 50"]').type('11');

            cy.get('button[type="submit"]').click();
        });

        it('shows an error when title is missing', () => {
            cy.visit('/concerts/add');

            selectFirstOption('select:eq(0)');
            cy.get('input[type="date"]').type(FUTURE_DATE);
            cy.get('input[type="time"]').type('20:00');
            cy.get('textarea').type('No title concert');
            cy.get('input[placeholder="Price in €"]').type('25');
            cy.get('input[placeholder="e.g. 50"]').type('11');

            cy.get('button[type="submit"]').click();
            cy.url().should('include', '/concerts/add');
        });

        it('shows an error when total seats exceed location capacity', () => {
            cy.visit('/concerts/add');

            cy.get('input[type="text"]').first().type('Overcrowded Concert');
            selectFirstOption('select:eq(0)');
            cy.get('input[type="date"]').type(FUTURE_DATE);
            cy.get('input[type="time"]').type('20:00');
            cy.get('textarea').type('Too many seats');
            cy.get('input[placeholder="Price in €"]').type('10');
            cy.get('input[placeholder="e.g. 50"]').type('99999');

            cy.get('button[type="submit"]').click();
            cy.contains('exceeds').should('be.visible');
        });
    });

    describe('Update', () => {
        beforeEach(() => cy.loginAsAdmin());

        it('admin can edit a concert title', () => {
            const original = `To Be Updated ${Date.now()}`;
            const updated   = `Updated By Cypress ${Date.now()}`;

            cy.authenticatedRequest({
                method: 'POST',
                url: `${Cypress.env('apiUrl')}/concerts`,
                body: {
                    title: original,
                    locationId: 1,
                    startingDay: FUTURE_DATE,
                    startingHour: '19:00',
                    description: 'Original description',
                    tickets: [{ seatType: 'GENERAL', price: 20, quantity: 15 }],
                },
            });

            cy.visit('/admin');
            cy.contains(original)
                .closest('.concert-container')
                .find('button').contains('Edit')
                .click();

            cy.get('input[type="text"]').first().clear().type(updated);
            cy.get('button[type="submit"]').click();

            cy.url().should('eq', `${Cypress.config('baseUrl')}/concerts`);
            cy.contains(updated).should('be.visible');
        });
    });

    describe('Delete', () => {
        beforeEach(() => cy.loginAsAdmin());

        it('admin can delete a concert after confirmation', () => {
            const title = `To Be Deleted ${Date.now()}`;

            cy.authenticatedRequest({
                method: 'POST',
                url: `${Cypress.env('apiUrl')}/concerts`,
                body: {
                    title,
                    locationId: 1,
                    startingDay: FUTURE_DATE,
                    startingHour: '19:00',
                    description: 'Delete me',
                    tickets: [{ seatType: 'GENERAL', price: 20, quantity: 15 }],
                },
            });

            cy.visit('/admin');
            cy.contains(title)
                .closest('.concert-container')
                .as('targetCard');
            cy.get('@targetCard').find('button').contains('Delete').click();
            cy.get('button').contains('Yes, delete').click();

            cy.contains(title).should('not.exist');
        });
    });
});