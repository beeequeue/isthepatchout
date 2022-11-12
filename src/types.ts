/* eslint-disable @typescript-eslint/naming-convention */
import type { Database } from "./types.generated"

export type { Database }

export type Patch = Database["public"]["Tables"]["patches"]["Row"]
export type PushSubscription = Database["public"]["Tables"]["subscriptions"]["Row"]
export type PushEventPatch = Patch & {
  type: "patch"
}
