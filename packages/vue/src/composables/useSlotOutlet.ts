import { defineComponent, onBeforeUpdate, renderSlot, shallowRef } from 'vue'
import type { Slot } from 'vue'

/**
 * A component rendering the caller's slot `name`, falling back to its own default slot like `<slot>` does. Attrs
 * passed to the outlet become the slot props (`<Outlet v-bind="slotProps">` ≙ `<slot :name v-bind="slotProps">`).
 *
 * Use it in place of a `<slot>` outlet nested inside another component's slot content: Vue flags such slots as
 * forwarded, which re-renders that component (and its children) on every render of the caller even when nothing
 * it shows changed.
 */
export function useSlotOutlet<S extends object>(slots: S, name: keyof S & string) {
  const read = () => slots[name] as Slot | undefined
  const slot = shallowRef(read())
  // The outlet's ancestors no longer re-render with the caller, so mirror slot swaps (e.g. `<template v-if #name>`)
  // into a ref the outlet tracks. Stable slots keep their identity, so this triggers nothing on ordinary renders.
  onBeforeUpdate(() => {
    slot.value = read()
  })
  return defineComponent({
    name: 'SlotOutlet',
    inheritAttrs: false,
    setup(_, { slots: own, attrs }) {
      return () => renderSlot({ [name]: slot.value }, name, { ...attrs }, own.default)
    },
  })
}
