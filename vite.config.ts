import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
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
  ],
}))
