describe("intro", () => {
  it("opens app", () => {
    cy.visit("https://starklings.app");
    cy.contains("starklings.app");
    cy.githubFakeLogin();
    cy.get("button").contains("Start coding").click();
  });

  it("intro1", () => {
    cy.testExercise("intro1");
  });

  it("intro2", () => {
    cy.testExercise("intro2");
  });

});
