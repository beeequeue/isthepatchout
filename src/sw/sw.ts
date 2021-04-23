import { precacheAndRoute } from "workbox-precaching"

console.log("init sw")

self.addEventListener("error", function (e) {
  console.error(e.filename, e.lineno, e.colno, e.message)
})

self.addEventListener("push", (e) => {
  console.log(e)
})

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST)
