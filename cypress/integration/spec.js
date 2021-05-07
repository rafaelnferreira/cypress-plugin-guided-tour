/// <reference types="cypress"/>

describe('guided steps test', () => {

  beforeEach(() => {
    cy.visit('/cypress/fixtures/index.html')
    .guide('Sample test case being guided', 1000)
  })

  it('can display a tour for the two elements in the page', () => {
    cy.get('input')
    .guide('Type something')
    .clear()
    .type('Interesting text')

    cy.get('button')
    .guide('And click on the button')

  })

})
