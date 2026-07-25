export type Patch = {
  id: string
  number: number
  releasedAt: string | null
  links: string[] // TODO: db type is nullable but is never null
}

export type PushEventPatch = Patch & {
  type: "patch"
}
