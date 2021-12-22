/// <reference types="cypress" />

// ignore uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});



