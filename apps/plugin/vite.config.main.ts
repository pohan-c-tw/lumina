import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@main": resolve(__dirname, "src/main"),
      "@plugin-shared": resolve(__dirname, "src/shared"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main/index.ts"),
      name: "FigmaPluginMain",
      formats: ["iife"],
      fileName: () => "main.js",
    },
    target: "es6",
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
