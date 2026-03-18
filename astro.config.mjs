import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://grzegorztomicki.pl",
  output: "static",
  outDir: "./dist",
  publicDir: "./public",

  build: {
    assets: "assets",
    inlineStylesheets: "auto",
    format: "file",
  },
});
