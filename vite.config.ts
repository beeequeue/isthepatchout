import { config } from "dotenv"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import { injectHtml as InjectHtml } from "vite-plugin-html"
import WindiCSS from "vite-plugin-windicss"
import { VitePWA } from "vite-plugin-pwa"

config()

const s = JSON.stringify

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  define: {
    "import.meta.env.SENTRY_DSN": s(process.env.SENTRY_DSN),
    "import.meta.env.VERCEL_ENV": s(process.env.VERCEL_ENV),
    "import.meta.env.VERCEL_GIT_COMMIT_SHA": s(process.env.VERCEL_GIT_COMMIT_SHA),
  },
  plugins: [
    Vue(),
    WindiCSS(),
    InjectHtml({
      injectData: {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      },
    }),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src/sw",
      filename: "sw.ts",
      base: "/",
      manifest: {
        name: "Is the Patch Out?",
        short_name: "isthepatchout",
        ["gcm_sender_id" as any]: process.env.VITE_VAPID_PUBLIC_KEY as string,
        background_color: "#111",
        theme_color: "#111",
        icons: [
          {
            src: "/android-chrome-144x144.png?v=2",
            sizes: "144x144",
            type: "image/png",
          },
        ],
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
})
