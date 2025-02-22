/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add("githubFakeLogin", () => {
  localStorage.setItem("username", "cypress");
  localStorage.setItem("githubEnabled", "true");
});

Cypress.Commands.add("clickCompile", () => {
  cy.get('[data-cy="run-button"]').click();
});

Cypress.Commands.add("checkSuccess", () => {
  cy.get(".MuiAlert-message").contains("Great");
});

Cypress.Commands.add("clearEditor", () => {
  cy.get("#compatibility-editor").type("{selectAll}{backspace}");
});

Cypress.Commands.add("testExercise", (exerciseName: string) => {
  cy.visit(`/exercise/${exerciseName}?compatibility=true`);
  cy.githubFakeLogin();
  cy.fixture(`${exerciseName}.cairo`).then((resolution) => {
    // const regex = /^[ \t]*}/gm;
    const escapedBrackets = resolution.replaceAll("{", "{{}");
    // .replaceAll(regex, "{downArrow}");
    cy.get("#compatibility-editor").type(escapedBrackets);
  });
  cy.clickCompile();
  cy.checkSuccess();
});

declare global {
  namespace Cypress {
    interface Chainable {
      githubFakeLogin(): void;
      clickCompile(): void;
      checkSuccess(): void;
      testExercise(exerciseName: string): void;
    }
  }
}
