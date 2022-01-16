/// <reference types="Cypress" />

describe('The Reise Page', () => {
    beforeEach(() => {
        cy.request('POST', 'https://travel-addict-backend-server.herokuapp.com/login', {
            "email": "admin@ta",
            "password": "admin"
        })
        cy.visit('/html/reise.html')
        // should arrive on login page
        cy.url().should('contain', '/reise.html')
    })

    it.only('persists after adding a new reise', () => {
        cy.get('div[class="container"]').find('li').then(($li) => {
            if ($li.length == 0) {
                cy.log('is empty')
            }
            cy.log('is not empty')
            cy.log($li.length)

        })
        cy.get('div[class="container"]').find('li').then(($el) => {
            const itemCount = Cypress.$($el).length;
            cy.log(itemCount)
            cy.fillReiseForm()
            cy.get('button[type="submit"]').click()
            cy.intercept({
                method: 'POST',
                url: 'https://travel-addict-backend-server.herokuapp.com/reisen',
            }).as('dataPostReisen');
            cy.wait('@dataPostReisen').its('response.statusCode').should('equal', 201)
            cy.reload()
            // should persist after reload
            cy.get('div[class="container"]').find('li').then(($el) => {
                const itemCountAfterAdding = Cypress.$($el).length;
                expect(itemCountAfterAdding).to.equal(itemCount + 1)
            })
        })
    })

    it('persists after adding a new reise', () => {
        cy.get('div[class="container"]').find('li').then(($el) => {
            const itemCount = Cypress.$($el).length;
            cy.log(itemCount)
            cy.fillReiseForm()
            cy.get('button[type="submit"]').click()
            cy.intercept({
                method: 'POST',
                url: 'https://travel-addict-backend-server.herokuapp.com/reisen',
            }).as('dataPostReisen');
            cy.wait('@dataPostReisen').its('response.statusCode').should('equal', 201)
            cy.reload()
            // should persist after reload
            cy.get('div[class="container"]').find('li').then(($el) => {
                const itemCountAfterAdding = Cypress.$($el).length;
                expect(itemCountAfterAdding).to.equal(itemCount + 1)
            })
        })
    })
})