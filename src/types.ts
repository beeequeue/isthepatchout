import { definitions } from "./generated"

export type Patch = definitions["patches"]
export type PushSubscription = definitions["subscriptions"]

export type PushEventPatch = Patch & {
  type: "patch"
}
