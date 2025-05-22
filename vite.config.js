import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  publicDir: "public",
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
