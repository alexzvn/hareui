import { computed, shallowRef } from 'vue'

import type { SheetStackEntry } from './Sheet.types'

// Every mounted sheet, bottom-most first. A sheet's view timeline is named after its index (`--sheet-timeline-<i>`)
// and scoped to the document, so the backdrop and the sheets below it can bind animations to it.
const stack = shallowRef<SheetStackEntry[]>([])

const syncTimelineScope = () => {
  if (typeof document === 'undefined') return
  const { style } = document.documentElement
  if (!stack.value.length) {
    style.removeProperty('timeline-scope')
    return
  }

  const names = stack.value.map((_, index) => `--sheet-timeline-${index}`)
  style.setProperty('timeline-scope', names.join(', '))
}

/** Adds a mounted sheet on top of the stack; returns its removal. */
export const registerSheet = (entry: SheetStackEntry) => {
  stack.value = [...stack.value, entry]
  syncTimelineScope()

  return () => {
    stack.value = stack.value.filter((item) => item !== entry)
    syncTimelineScope()
  }
}

/** The sheet's stack index (`-1` when unmounted) and the sheets stacked above it. */
export const useSheetStack = (entry: SheetStackEntry) =>
  computed(() => {
    const index = stack.value.indexOf(entry)

    return { index, descendants: index === -1 ? [] : stack.value.slice(index + 1) }
  })
