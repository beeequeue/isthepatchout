import * as Fathom from "fathom-client"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  Fathom.load(config.public.fathomSiteId, {
    url: "https://twentythree-restored.haglund.dev/script.js",
    spa: "auto",
  })
})
