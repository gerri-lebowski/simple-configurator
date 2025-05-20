import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  publicDir: "public",
  base: "/simple-configurator/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3000,
    open: true,
  },
});
