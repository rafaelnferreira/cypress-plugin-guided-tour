/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		guide(text: string, delay?: number): Chainable
	}
}
