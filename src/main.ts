import * as Fathom from "fathom-client"
import { createApp } from "vue"

import App from "./App.vue"

import "modern-normalize"

createApp(App).mount("#app")

Fathom.load(import.meta.env.VITE_FATHOM_SITE_ID as string, {
  url: "https://mammal.haglund.dev/script.js",
  spa: "auto",
})
