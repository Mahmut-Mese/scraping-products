import React from 'react';
import App from '../../src/App';

describe('App', () => {
    beforeEach(() => {
        cy.mount(<App />);
    });

    it('check everything is working', () => {
        cy.get('h1').contains('Package List')
        cy.get('li').should('have.length', 6);
        cy.get('[data-cy="header"]').should('have.length', 6);
        cy.get('[data-cy="description"]').should('have.length', 6);
        cy.get('[data-cy="price"]').should('have.length', 6);
        cy.get('[data-cy="discount"]').should('have.length', 3);
        
        cy.get('[data-cy="li"]').then((products) => {
            expect(products).to.have.length(6)
      
            products.each((index, product: HTMLElement) => {
              const name = Cypress.$(product).find('[data-cy="header"]').text()
              const description = Cypress.$(product).find('[data-cy="description"]').text()
              const price = Cypress.$(product).find('[data-cy="price"]').text()
      
              expect(name).to.be.a('string')
              expect(description).to.be.a('string')
              expect(price).to.match(/^£\d{2,}\.\d{2}$/)
        })
      })
    });
});
