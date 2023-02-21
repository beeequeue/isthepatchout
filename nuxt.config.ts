/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type SecurityModule from "nuxt-security"
import { defineNuxtConfig } from "nuxt/config"

import "nuxt-icon"
import "nuxt-security"
import "nuxt-windicss"
import "@nuxtjs/google-fonts"
import "@nuxtjs/fontaine"
import "@nuxtjs/supabase"
import "@vueuse/nuxt"

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
    "nuxt-icon",
    "nuxt-security",
    "nuxt-windicss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    // "@nuxtjs/pwa",
  ],

  sourcemap: true,
  vite: {
    envPrefix: ["VITE_", "VERCEL_"],
  },

  css: ["@/assets/base.css"],
  app: {
    head: {
      title: "Is the Patch Out Yet?",
      meta: [{ name: "theme-color", content: "#111111" }],
      link: [{ rel: "preconnect", href: process.env.SUPABASE_URL }],
      htmlAttrs: { lang: "en" },
    },
  },

  experimental: {
    emitRouteChunkError: "reload",
  },
  security: {
    headers: {
      xXSSProtection: false,
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    },
    rateLimiter: {
      value: {
        interval: "minute",
        tokensPerInterval: 60,
      },
      route: "",
    },
  },
  googleFonts: {
    preconnect: true,
    prefetch: true,
    families: {
      Rubik: [400],
    },
  },
  fontMetrics: {
    fonts: ["Rubik", { family: "Radiance", src: "fonts/Radiance-SemiBold.woff2" }],
    fallbacks: ["Helvetica"],
  },

  typescript: { strict: true, shim: false },
})

// VitePWA({
//   strategies: "injectManifest",
//   srcDir: "src/sw",
//   filename: "sw.ts",
//   base: "/",
//   manifest: {
//     name: "Is the Patch Out?",
//     short_name: "isthepatchout",
//     ["gcm_sender_id" as any]: process.env.VITE_VAPID_PUBLIC_KEY as string,
//     background_color: "#111",
//     theme_color: "#111",
//     icons: [
//       {
//         src: "/android-chrome-144x144.png?v=3",
//         sizes: "144x144",
//         type: "image/png",
//       },
//       {
//         src: "/android-chrome-192x192.png?v=3",
//         sizes: "192x192",
//         type: "image/png",
//       },
//       {
//         src: "/android-chrome-512x512.png?v=3",
//         sizes: "512x512",
//         type: "image/png",
//       },
//     ],
//     display: "standalone",
//     orientation: "portrait",
//   },
// }),
