export type Patch = {
  /**
   * The patch ID, e.g. `7.00`, `7.28c`, `7.29`
   *
   * Note:
   * This is a Primary Key.<pk/>
   */
  id: string
  links: string[]
  releasedAt?: string
  number: number
}

export type PushSubscription = {
  endpoint: string
  type: "push" | "discord"
  createdAt: string
  auth: string
  extra: string | null
  environment: string
  lastNotified: Patch["number"]
}

export type PushEventPatch = Patch & {
  type: "patch"
}
