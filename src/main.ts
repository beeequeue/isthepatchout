import * as Fathom from "fathom-client"
import { createApp } from "vue"

import { captureException, init, setTag } from "@sentry/vue"

import App from "./app.vue"

import "virtual:windi.css"
import "virtual:windi-devtools"
import "./base.css"

const app = createApp(App)

init({
  enabled: import.meta.env.VERCEL_ENV !== "development" && !!import.meta.env.SENTRY_DSN,
  dsn: import.meta.env.SENTRY_DSN as string | undefined,
  release: import.meta.env.VERCEL_GIT_COMMIT_SHA as string | undefined,
  environment: import.meta.env.VERCEL_ENV as string,
  Vue: app as any,
})

setTag("app", "ui")

app.config.errorHandler = (error, _, info) => {
  if (import.meta.env.VERCEL_ENV !== "production") console.error(error)

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

document.querySelector("#background")?.classList.add("!opacity-100")
