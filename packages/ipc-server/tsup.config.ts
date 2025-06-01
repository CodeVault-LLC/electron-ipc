import { defineConfig } from "tsup";
import { version } from "./package.json";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  bundle: true,

  format: ["esm"],
  platform: "node",

  dts: true,
  splitting: false,
  minify: true,
  sourcemap: true,
  clean: true,
  noExternal: ["@codevault/shared"],
  env: {
    PKG_VERSION: version,
  },
  outExtension({ format }) {
    return {
      js: `.${format === "esm" ? "mjs" : "cjs"}`,
    };
  },
  external: ["electron"],
});
