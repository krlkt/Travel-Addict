/// <reference types="Cypress" />

describe('The Login Page', () => {
    beforeEach(() => {
        cy.visit('/')
        // should arrive on login page
        cy.url().should('contain', 'https://travel-addict.netlify.app')
    })

    it('shows error message on wrong credentials', () => {
        cy.get('#email').type('huehne@htw-berlin.de')
        cy.get('#password').type('wrongPassword')
        cy.get('#login').click()
        // should show the invalid login div
        cy.get('#invalidLogin').should('be.visible')
    })

    it.only('redirects to home page after a successful login', () => {
        cy.get('#email').type('huehne@htw-berlin.de')
        cy.get('#password').type('hunter2')
        cy.get('#login').click()
        // should show the invalid login div
        cy.url().should('contain', '/home.html')
        cy.get('a[data-cy="nav_reise"]').click()
        cy.getCookies()
            .should('have.length', 1)
    })

    it('redirects to login page after a logout', () => {
        cy.get('#email').type('huehne@htw-berlin.de')
        cy.get('#password').type('hunter2')
        cy.get('#login').click()
        // should show the invalid login div
        cy.url().should('contain', '/home.html')
        cy.get('#logout').click()
        cy.url().should('contain', '/index.html')
    })
})