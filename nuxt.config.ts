/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type SecurityModule from "nuxt-security"
import { defineNuxtConfig } from "nuxt/config"

import "nuxt-icon"
import "nuxt-security"
import "nuxt-windicss"
import "@nuxtjs/google-fonts"
import "@nuxtjs/fontaine"
import "@vueuse/nuxt"

import type { ModuleOptions, NuxtModule } from "@nuxt/schema"

type GetOptions<T> = T extends NuxtModule<infer O> ? O : ModuleOptions

declare module "@nuxt/schema" {
  interface NuxtConfig {
    security?: Partial<GetOptions<typeof SecurityModule>>
  }
}

export default defineNuxtConfig({
  modules: [
    "nuxt-icon",
    "nuxt-security",
    "nuxt-windicss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "@vueuse/nuxt",
    // "@nuxtjs/pwa",
  ],

  alias: {
    "@ivanv/vue-collapse-transition":
      "@ivanv/vue-collapse-transition/src/CollapseTransition.vue",
  },
  sourcemap: true,
  vite: {
    envPrefix: ["VITE_", "VERCEL_"],
  },

  security: {
    headers: { contentSecurityPolicy: false },
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
  },

  experimental: {},
  typescript: { strict: true, shim: false },
})
