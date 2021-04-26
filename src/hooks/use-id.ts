import { nanoid } from "nanoid"

import { useLocalStorage } from "@vueuse/core"

import { LocalStorageKey } from "../constants"

export const useId = () => useLocalStorage(LocalStorageKey.ID, nanoid(25))
