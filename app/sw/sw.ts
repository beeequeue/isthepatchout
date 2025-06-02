/* eslint-disable no-restricted-globals */
import type { PushEventPatch } from "~~/lib/types"

enum NotificationAction {
  ViewReleaseNotes = "view-release-notes",
}

self.addEventListener("push" as never, (e: PushEvent) => {
  if (e.data == null) {
    throw new Error("Got no data in push event")
  }

  const target = e.currentTarget as ServiceWorkerGlobalScope
  const data = e.data.json() as PushEventPatch

  if (data.type === "patch") {
    void target.registration.showNotification(
      `The ${data.id} patch notes have been released!`,
      {
        body: "Check them out!",
        data,
        actions: [
          { title: "Open patch page", action: NotificationAction.ViewReleaseNotes },
        ],
        vibrate: [1000, 250, 1000, 250, 1000],
      },
    )
  }
})

self.addEventListener("notificationclick" as never, (e: NotificationEvent) => {
  const target = e.currentTarget as ServiceWorkerGlobalScope
  const data = e.notification.data as PushEventPatch

  if (data.links.length > 0) {
    void target.clients.openWindow(data.links[0])
  }

  e.notification.close()
})

console.debug((self as unknown as Record<string, unknown>).__WB_MANIFEST)
