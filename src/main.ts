import * as Fathom from "fathom-client"
import { createApp } from "vue"

import App from "./app.vue"

import "virtual:windi.css"
import "virtual:windi-devtools"
import "./base.css"

const app = createApp(App)

Fathom.load(import.meta.env.VITE_FATHOM_SITE_ID as string, {
  url: "https://twentythree-restored.haglund.dev/script.js",
  spa: "auto",
})

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  void (async () => {
    const { registerSW } = await import("virtual:pwa-register")
    const updateSW = registerSW({
      onNeedRefresh: () => {
        void updateSW()
      },
      immediate: true,
    })
  })()
}

app.mount("#app")

document.querySelector("#background")?.classList.add("!opacity-100")
