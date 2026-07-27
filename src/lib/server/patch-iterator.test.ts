import { describe, expect, it } from "vitest"

import type { Patch } from "#/types.ts"

import { announcePatch, getPatchFeedIterator } from "./patch-iterator.ts"

function patch(number: number): Patch {
  return {
    id: `patch-${number}`,
    number,
    releasedAt: null,
    links: [],
  }
}

describe("patch feed", () => {
  it("does not replay patches announced before subscription", async () => {
    announcePatch(patch(1))

    const consumer = getPatchFeedIterator()
    const result = consumer.next()

    announcePatch(patch(2))

    await expect(result).resolves.toEqual({
      done: false,
      value: patch(2),
    })
  })

  it("fans out an announcement to all waiting consumers", async () => {
    const firstConsumer = getPatchFeedIterator()
    const secondConsumer = getPatchFeedIterator()

    const firstResult = firstConsumer.next()
    const secondResult = secondConsumer.next()

    announcePatch(patch(3))

    await expect(firstResult).resolves.toEqual({
      done: false,
      value: patch(3),
    })

    await expect(secondResult).resolves.toEqual({
      done: false,
      value: patch(3),
    })
  })

  it("delivers subsequent announcements", async () => {
    const consumer = getPatchFeedIterator()

    const firstResult = consumer.next()
    announcePatch(patch(4))

    await expect(firstResult).resolves.toEqual({
      done: false,
      value: patch(4),
    })

    const secondResult = consumer.next()
    announcePatch(patch(5))

    await expect(secondResult).resolves.toEqual({
      done: false,
      value: patch(5),
    })
  })

  it("does not deliver an announcement made between next calls", async () => {
    const consumer = getPatchFeedIterator()

    const firstResult = consumer.next()
    announcePatch(patch(6))

    await expect(firstResult).resolves.toEqual({
      done: false,
      value: patch(6),
    })

    announcePatch(patch(7))

    const secondResult = consumer.next()
    announcePatch(patch(8))

    await expect(secondResult).resolves.toEqual({
      done: false,
      value: patch(8),
    })
  })

  it("returns done: true from return()", async () => {
    const consumer = getPatchFeedIterator()

    await expect(consumer.return!()).resolves.toEqual({
      done: true,
      value: undefined,
    })
  })

  it("never returns done: true from next(), even after return()", async () => {
    const consumer = getPatchFeedIterator()

    await consumer.return!()

    const result = consumer.next()
    announcePatch(patch(9))

    await expect(result).resolves.toEqual({
      done: false,
      value: patch(9),
    })
  })

  it("propagates errors passed to throw()", async () => {
    const consumer = getPatchFeedIterator()
    const error = new Error("test error")

    await expect(consumer.throw!(error)).rejects.toBe(error)
  })

  it("is an async iterable that returns itself", () => {
    const consumer = getPatchFeedIterator()

    expect(consumer[Symbol.asyncIterator]()).toBe(consumer)
  })
})
