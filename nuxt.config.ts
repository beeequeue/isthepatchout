/* eslint-disable ts/consistent-type-definitions */
import path from "path"

import directives from "@unocss/transformer-directives"
import { defineNuxtConfig } from "nuxt/config"

import pkgJson from "./package.json" with { type: "json" }

const env = process.env.VERCEL_ENV as "production" | "development" | undefined

export default defineNuxtConfig({
  compatibilityDate: "2026-07-21",

  nitro: { preset: "node-server" },
  experimental: {
    emitRouteChunkError: "automatic",
    headNext: true,
  },

  runtimeConfig: {
    vapidPrivateKey: "",
    gcmApiKey: "",
    checkToken: "",
    discordClientId: "",
    discordClientSecret: "",

    public: {
      env,
      PROD: env === "production",
      DEV: env === "development",

      apiUrl: "http://localhost:3000",
      sentryDsn: "https://e4f5998ed2e349b985f2150cba13550e@o524049.ingest.sentry.io/5721085",
      vapidPublicKey:
        "BMxxkM7nyik9wtBsK6wVnHxfsOgPVsA05QmW3AE5M8bPAVoAV9LGX3i26p-mZkDJd7zj7iZufOPdI7Cpd2IYs1M",
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "nuxt-security",
    "@unocss/nuxt",
    "@morev/vue-transitions/nuxt",
  ],

  sourcemap: true,

  vue: {
    propsDestructure: true,
  },
  vite: {
    define: {
      REPOSITORY: JSON.stringify(pkgJson.repository),
    },
    build: { minify: true },
    resolve: {
      alias: {
        ws: path.resolve("./test.mjs"),
      },
    },
  },

  css: ["assets/base.css"],
  unocss: {
    icons: true,
    wind3: true,
    webFonts: true,
    preflight: true,
    transformers: [directives()],
  },

  app: {
    head: {
      title: "Is the Patch Out Yet?",
      meta: [{ name: "theme-color", content: "#111111" }],
      link: [
        { rel: "preconnect", href: process.env.SUPABASE_URL },
        { rel: "preload", href: "/background.svg", as: "image" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
      htmlAttrs: { lang: "en" },
    },
  },

  supabase: {
    redirect: false,
  },

  security: {
    headers: {
      xXSSProtection: false,
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    },
    rateLimiter: {
      interval: "minute",
      tokensPerInterval: 60,
    },
  },

  fonts: {
    defaults: {
      weights: ["400"],
      styles: ["normal"],
      subsets: ["latin"],
      preload: true,
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
