/// <reference types="Cypress" />

describe('The Login Page', () => {
    beforeEach(() => {
        cy.visit('/')
        // should arrive on login page
        cy.url().should('contain', 'https://travel-addict.netlify.app')
        cy.intercept('https://travel-addict-backend-server.herokuapp.com/login').as('login')
    })

    it('shows error message on wrong credentials', () => {
        cy.get('#email').type('huehne@htw-berlin.de')
        cy.get('#password').type('wrongPassword')
        cy.get('#login').click()
        cy.wait('@login')
        // should show the invalid login div
        cy.get('#invalidLogin').should('be.visible')
    })

    it('redirects to home page after a successful login', () => {
        cy.get('#email').type('huehne@htw-berlin.de')
        cy.get('#password').type('hunter2')
        cy.get('#login').click()
        cy.wait('@login')
        // url should contain /home.html after a successful login
        cy.url().should('contain', '/home.html')
    })

    it('redirects to login page after a logout', () => {
        cy.get('#email').type('huehne@htw-berlin.de')
        cy.get('#password').type('hunter2')
        cy.get('#login').click()
        cy.wait('@login')
        cy.url().should('contain', '/home.html')
        // url should contain /index.html after a successful logout
        cy.get('#logout').click()
        cy.url().should('contain', '/index.html')
    })
})