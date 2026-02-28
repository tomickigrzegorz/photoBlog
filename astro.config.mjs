import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://grzegorztomicki.pl",
  output: "static",
  outDir: "./dist",
  publicDir: "./public",

  build: {
    assets: "assets",
    inlineStylesheets: "auto",
  },

  integrations: [sitemap()],
});
