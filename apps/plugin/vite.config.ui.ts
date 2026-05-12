import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  root: "src/ui",
  resolve: {
    alias: {
      "@plugin-shared": resolve(__dirname, "src/shared"),
      "@ui": resolve(__dirname, "src/ui"),
    },
  },
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/ui/ui.html"),
      output: {
        inlineDynamicImports: true,
        format: "iife",
      },
    },
  },
});
