import * as Fathom from "fathom-client"
import { createApp } from "vue"

import { init, setTag } from "@sentry/vue"

import App from "./app.vue"

import "virtual:windi.css"
import "virtual:windi-devtools"
import "./base.css"

const app = createApp(App)

setTag("app", "ui")

Fathom.load(import.meta.env.VITE_FATHOM_SITE_ID as string, {
  url: "https://mammal.haglund.dev/script.js",
  spa: "auto",
})

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  void (async () => {
    const { registerSW } = await import("virtual:pwa-register")
    const updateSW = registerSW({
      onNeedRefresh: () => updateSW(),
      immediate: true,
    })
  })()
}

init({
  app,
  enabled: import.meta.env.VERCEL_ENV !== "development" && !!import.meta.env.SENTRY_DSN,
  dsn: import.meta.env.SENTRY_DSN as string | undefined,
  release: import.meta.env.VERCEL_GIT_COMMIT_SHA as string | undefined,
  environment: import.meta.env.VERCEL_ENV as string,
})

app.mount("#app")

document.querySelector("#background")?.classList.add("!opacity-100")
