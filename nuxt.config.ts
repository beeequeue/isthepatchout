/* eslint-disable ts/consistent-type-definitions */
import path from "path"

import browserslist from "browserslist"
import { resolveToEsbuildTarget } from "esbuild-plugin-browserslist"
import { defineNuxtConfig } from "nuxt/config"
import type SecurityModule from "nuxt-security"

import type { ModuleOptions, NuxtModule } from "@nuxt/schema"

type GetOptions<T> = T extends NuxtModule<infer O> ? O : ModuleOptions

declare module "@nuxt/schema" {
  interface NuxtConfig {
    security?: Partial<GetOptions<typeof SecurityModule>>
  }
}

const env = process.env.VERCEL_ENV as "production" | "development" | undefined

export default defineNuxtConfig({
  nitro: { preset: "vercel" },

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
      sentryDsn:
        "https://e4f5998ed2e349b985f2150cba13550e@o524049.ingest.sentry.io/5721085",
      fathomSiteId: "FVADOKGJ",
      vapidPublicKey:
        "BMxxkM7nyik9wtBsK6wVnHxfsOgPVsA05QmW3AE5M8bPAVoAV9LGX3i26p-mZkDJd7zj7iZufOPdI7Cpd2IYs1M",
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
    "@vite-pwa/nuxt",
    "@vueuse/nuxt",
    "nuxt-security",
    "nuxt-windicss",
    "@morev/vue-transitions/nuxt",
  ],

  sourcemap: true,

  vite: {
    build: {
      minify: true,
      target: resolveToEsbuildTarget(browserslist(), {
        printUnknownTargets: false,
      }),
    },
    resolve: {
      alias: {
        "readable-stream": "node:stream",
        "node-fetch": "fetch-unfiller/node",
        "cross-fetch": "fetch-unfiller/node",
      },
    },
  },

  css: ["virtual:windi.css", "assets/base.css"],

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

  experimental: {
    emitRouteChunkError: "automatic",
    headNext: true,
  },

  supabase: {
    redirect: false,
  },

  pwa: {
    srcDir: "sw",
    filename: "sw.ts",
    outDir: path.resolve(__dirname, ".vercel", "output", "static"),
    base: "/",

    strategies: "injectManifest",
    injectRegister: "inline",
    includeManifestIcons: false,
    registerWebManifestInRouteRules: true,
    minify: true,

    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },

    manifest: {
      name: "Is the Patch Out?",
      short_name: "isthepatchout",
      ["gcm_sender_id" as never]: process.env.NUXT_PUBLIC_VAPID_PUBLIC_KEY!,
      background_color: "#111",
      theme_color: "#111",
      orientation: "portrait",
    },

    devOptions: {
      enabled: true,
      type: "module",
    },
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

  googleFonts: {
    preconnect: true,
    preload: true,
    display: "swap",
    subsets: ["latin"],
    families: {
      Rubik: [400],
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

  compatibilityDate: "2024-08-12",
})
