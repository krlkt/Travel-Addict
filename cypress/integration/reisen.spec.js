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

    it('persists after adding a new reise', () => {
        cy.get('div[class="container"]').find('li').then(($el) => {
            const itemCount = Cypress.$($el).length;
            cy.log(itemCount)
            cy.fillReiseForm('Reise nach Bali: ' + Cypress._.random(0, 1e6))
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

    it('can delete a reise', () => {
        cy.get('div[class="container"]').find('li').then(($el) => {
            // first add a new reise
            const itemCount = Cypress.$($el).length;
            const name = 'to be deleted Reise: ' + Cypress._.random(0, 1e6)
            cy.fillReiseForm(name)
            cy.get('button[type="submit"]').click()
            cy.intercept({
                method: 'POST',
                url: 'https://travel-addict-backend-server.herokuapp.com/reisen',
            }).as('dataPostReisen');
            cy.wait('@dataPostReisen').its('response.statusCode').should('equal', 201)
            cy.reload()
            cy.get('div[class="container"]').find('li').then(($el) => {
                const itemCountAfterAdding = Cypress.$($el).length;
                expect(itemCountAfterAdding).to.equal(itemCount + 1)
            })
            // then delete the reise the newly added Reise
            cy.get('div[class="container"]').find('input[id="inputName"][value^="to be deleted Reise:"]')
                // get input div parent, then find the 'x' button
                .parent().find('span').contains('X').click()
            cy.intercept({
                method: 'DELETE',
                url: 'https://travel-addict-backend-server.herokuapp.com/reisen/**',
            }).as('deleteReisen');
            cy.wait('@deleteReisen').its('response.statusCode').should('equal', 204)
            // reload the page and see whether the deleted Reise is deleted
            cy.reload()
            cy.get('div[class="container"]').find('li').then(($el) => {
                const itemCountAfterAddingAndDeleting = Cypress.$($el).length;
                expect(itemCountAfterAddingAndDeleting).to.equal(itemCount)
            })
        })
    })
    it('can edit a Reise', () => {
        cy.get('div[class="container"]').find('li').then(($el) => {
            const reiseName = 'to be edited Reise: ' + Cypress._.random(0, 1e6)
            cy.fillReiseForm(reiseName)
            cy.get('button[type="submit"]').click()
            // wait for the server response
            cy.intercept({
                method: 'POST',
                url: 'https://travel-addict-backend-server.herokuapp.com/reisen',
            }).as('dataPostReisen');
            cy.wait('@dataPostReisen').its('response.statusCode').should('equal', 201)
            // reload the page
            cy.reload()
            // should persist after reload
            cy.get('div[class="container"]').find(`input[id="inputName"][value="${reiseName}"]`) // ^= means find value that starts with these string
                // edit country name
                .parent().find('input[id="inputLand"]').type('{backspace}{backspace}RU')
                // click on save
                .parent().find('button[id="save"]').click()
            cy.intercept({
                method: 'PUT',
                url: 'https://travel-addict-backend-server.herokuapp.com/reisen/**',
            }).as('editedReise');
            cy.wait('@editedReise').its('response.statusCode').should('equal', 200)
            cy.reload()
            // edited land should persist
            cy.get('div[class="container"]').find(`input[id="inputName"][value="${reiseName}"]`) // ^= means find value that starts with these string
                // edit country name
                .parent().find('input[id="inputLand"]').should('have.value', 'RU')
        })
    })
})