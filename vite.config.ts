import { config } from "dotenv"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"

config()

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vue(),
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
