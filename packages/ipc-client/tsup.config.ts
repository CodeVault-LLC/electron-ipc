import { defineConfig } from "tsup";
import { version } from "./package.json";

export default defineConfig({
  entry: ["src/renderer.ts"],
  outDir: "dist",

  bundle: true,

  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  minify: true,
  sourcemap: true,
  clean: true,
  env: {
    PKG_VERSION: version,
  },
  noExternal: ["@codevault/shared"],
  outExtension({ format }) {
    return {
      js: `.${format === "esm" ? "mjs" : "cjs"}`,
    };
  },
  external: ["electron"],
});
