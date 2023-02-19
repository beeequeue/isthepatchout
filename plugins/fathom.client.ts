import * as Fathom from "fathom-client"

Fathom.load(import.meta.env.VITE_FATHOM_SITE_ID, {
  url: "https://twentythree-restored.haglund.dev/script.js",
  spa: "auto",
})
