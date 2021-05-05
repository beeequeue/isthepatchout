import { precacheAndRoute } from "workbox-precaching"

import { init, captureException } from "@sentry/vue"

import type { PushEventPatch } from "../types"

init({
  enabled: import.meta.env.VERCEL_ENV !== "development" && !!import.meta.env.SENTRY_DSN,
  dsn: import.meta.env.SENTRY_DSN as string | undefined,
  release: import.meta.env.VERCEL_GIT_COMMIT_SHA as string | undefined,
  environment: import.meta.env.VERCEL_ENV as string,
})

enum NotificationAction {
  ViewReleaseNotes = "view-release-notes",
}

self.addEventListener("error", captureException)

self.addEventListener("push" as any, (e: PushEvent) => {
  if (e.data == null) {
    throw new Error("Got no data in push event")
  }

  const target = e.currentTarget as ServiceWorkerGlobalScope
  const data = e.data.json() as PushEventPatch

  if (data.type === "patch") {
    void target.registration.showNotification(`${data.id} has been released!`, {
      body: "Check out the patch notes!",
      data,
      actions: [
        { title: "Open patch page", action: NotificationAction.ViewReleaseNotes },
      ],
      vibrate: [1000, 250, 1000, 250, 1000],
    })
  }
})

self.addEventListener("notificationclick" as any, (e: NotificationEvent) => {
  const target = e.currentTarget as ServiceWorkerGlobalScope
  const data = e.notification.data as PushEventPatch

  if (data.links.length > 0) {
    void target.clients.openWindow(data.links[0])
  }
})

// @ts-ignore: Missing type
precacheAndRoute(self.__WB_MANIFEST)
