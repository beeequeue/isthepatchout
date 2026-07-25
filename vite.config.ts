import adapter from "@sveltejs/adapter-node"
import { sveltekit } from "@sveltejs/kit/vite"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import unocss from "@unocss/vite"
import evlog from "evlog/vite"
import sonda from "sonda/vite"
import { defineConfig } from "vitest/config"

import manifest from "./package.json" with { type: "json" }

export default defineConfig((env) => ({
  build: {
    sourcemap: process.env.ANALYZE != null,
  },
  css: {
    transformer: "lightningcss",
  },
  optimizeDeps: { include: ["canvas-confetti", "dotaver"] },

  define: {
    REPOSITORY: JSON.stringify(manifest.repository),
  },

  plugins: [
    unocss({ mode: env.command === "build" ? "per-module" : "global" }),
    sveltekit({
      experimental: { remoteFunctions: true },
      compilerOptions: { experimental: { async: true }, modernAst: true },
      adapter: adapter({ precompress: false }),
      preprocess: vitePreprocess(),
      serviceWorker: {
        register: true,
        options: { type: "module" },
      },
    }),
    evlog({ service: "itpo-sveltekit", sourceLocation: "dev" }),
    sonda({ sources: true, deep: true, enabled: process.env.ANALYZE != null }),
  ],

  server: {
    headers: {
      "Cache-Control": "public, max-age=0",
    },
  },

  test: {
    environment: "node",
  },
}))
