import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "node24",
  outDir: "dist",
  format: ["esm"],
  dts: false,
  clean: true,
});
