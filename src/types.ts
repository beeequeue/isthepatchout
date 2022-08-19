/* eslint-disable @typescript-eslint/naming-convention */
import type { Database } from "./types.generated"

export type { Database }

export type Patch = Database["public"]["Tables"]["patches"]["Row"]
export type PushSubscription = Database["public"]["Tables"]["subscriptions"]["Row"]
export type PushEventPatch = Patch & {
  type: "patch"
}

export type RealtimeChange<Table extends keyof Database["public"]["Tables"]> = {
  columns: Array<{ name: string; type: string }>
  commit_timestamp: string
  record?: Database["public"]["Tables"][Table]["Row"]
  old_record?: Database["public"]["Tables"][Table]["Row"]
  schema: keyof Database
  table: Table
  errors: unknown
  type: "INSERT" | "UPDATE" | "DELETE"
}
