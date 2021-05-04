import * as Fathom from "fathom-client"
import { createApp } from "vue"

import { captureException, init, setTag } from "@sentry/vue"

import App from "./App.vue"

import "modern-normalize"

const app = createApp(App)

init({
  debug: true,
  enabled:
    import.meta.env.VITE_VERCEL_ENV !== "development" &&
    !!import.meta.env.VITE_SENTRY_DSN,
  dsn: import.meta.env.VITE_SENTRY_DSN as string | undefined,
  environment: import.meta.env.VITE_VERCEL_ENV as string,
})

app.config.errorHandler = (error, _, info) => {
  if (import.meta.env.VITE_VERCEL_ENV !== "production") console.error(error)

  setTag("info", info)
  captureException(error)
}

Fathom.load(import.meta.env.VITE_FATHOM_SITE_ID as string, {
  url: "https://mammal.haglund.dev/script.js",
  spa: "auto",
})

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" })
  })
}

app.mount("#app")
