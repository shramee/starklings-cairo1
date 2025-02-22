import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    baseUrl: "http://localhost:4000",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("before:run", (details) => {});
    },
  },
});
