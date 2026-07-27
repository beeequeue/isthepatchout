import type { RequestLogger } from "evlog"

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      log: RequestLogger
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  // eslint-disable-next-line vars-on-top
  var REPOSITORY: string
}

export {}
