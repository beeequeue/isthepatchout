import type { Patch } from "#/types.ts"

type PatchIterator = AsyncIterableIterator<Patch>

let signal = Promise.withResolvers<Patch>()

export function announcePatch(patch: Patch): void {
  const waitingConsumers = signal

  // Future next() calls wait for the next announcement.
  signal = Promise.withResolvers<Patch>()

  // Every consumer awaiting the old shared promise receives this patch.
  waitingConsumers.resolve(patch)
}

export function getPatchFeedIterator(): PatchIterator {
  return {
    async next(): Promise<IteratorResult<Patch>> {
      const patch = await signal.promise

      return {
        done: false,
        value: patch,
      }
    },

    async return(): Promise<IteratorResult<Patch>> {
      return {
        done: true,
        value: undefined,
      }
    },

    async throw(error?: unknown): Promise<IteratorResult<Patch>> {
      throw error
    },

    [Symbol.asyncIterator]() {
      return this
    },
  }
}
