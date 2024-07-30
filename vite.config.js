import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/actions-test",
  mode: process.env.NODE_ENV,
  input: "./src/main.jsx",
  build: {
    assetsDir: "static",
  },
  server: {
    hmr: true,
    port: 3010,
    progress: true,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  resolve: {
    alias: [
      {
        find: "~",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
});
