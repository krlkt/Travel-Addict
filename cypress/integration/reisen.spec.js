/// <reference types="Cypress" />

describe('The Reise Page', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://travel-addict-backend-server.herokuapp.com/reisen', {
            // stub response to have an empty reise to start
            statusCode: 200,
            body:
                [{
                    "id": "224de688-5e63-495e-856a-b14253b5704b",
                    "name": "trip to russia",
                    "startDatum": "2021-12-24T00:00:00.000Z",
                    "endDatum": "2021-12-31T00:00:00.000Z",
                    "land": "RU",
                    "user_email": "huehne@htw-berlin.de",
                    "created_at": "2021-12-30T22:29:23.275Z"
                }]
        })
        cy.request('POST', 'https://travel-addict-backend-server.herokuapp.com/login', {
            "email": "huehne@htw-berlin.de",
            "password": "hunter2"
        })
        cy.visit('/html/reise.html')
        // should arrive on login page
        cy.url().should('contain', '/reise.html')
    })

    it.only('persists after adding a new reise', () => {
        cy.get('div[class="container"]').find('ul').then(($ul) => {
            if ($ul.length == 0) {
                cy.log('is empty')
            }
            cy.log('is not empty')
            cy.log($ul.length)

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