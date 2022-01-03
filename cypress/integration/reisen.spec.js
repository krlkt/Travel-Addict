/// <reference types="Cypress" />

describe('The Reise Page', () => {
    beforeEach(() => {
        cy.request('POST', 'https://travel-addict-backend-server.herokuapp.com/login', {
            "email": "huehne@htw-berlin.de",
            "password": "hunter2"
            // "email": "admin@ta",
            // "password": "admin"
        })
        cy.visit('/html/reise.html')
        // should arrive on login page
        cy.url().should('contain', '/reise.html')
    })

    it('persists after adding a new reise', () => {
        cy.fillReiseForm()
        cy.get('button[type="submit"]').click()
        cy.intercept({
            method: 'POST',
            url: 'https://travel-addict-backend-server.herokuapp.com/reisen',
        }).as('dataPostReisen');
        cy.wait('@dataPostReisen').its('response.statusCode').should('equal', 201)
        cy.wait(1000)
        cy.reload()
        // should persist
        cy.get('input[id="inputLand"]').should('have.value', 'ID')
    })
})