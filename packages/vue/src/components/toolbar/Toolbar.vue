<template>
  <Primitive
    ref="root"
    :as="as"
    :role="isNested ? 'group' : 'toolbar'"
    :aria-orientation="isNested ? undefined : orientation"
    data-slot="toolbar"
    :data-orientation="orientation"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    v-on="
      isNested
        ? {}
        : { keydownCapture: onKeydown, focusinCapture: onFocusin, focusoutCapture: onFocusout }
    "
  >
    <slot :orientation="orientation" />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { inject, provide, ref, toRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { toolbarContextKey } from './context'
import theme from './theme'
import type { ToolbarProps, ToolbarSlots } from './Toolbar.types'

const props = withDefaults(defineProps<ToolbarProps>(), { as: 'div', orientation: 'horizontal' })
defineSlots<ToolbarSlots>()

// A toolbar inside another toolbar is a plain group; the outer one owns arrow-key navigation (React Aria `useToolbar`).
// Unlike React Aria it drops `aria-orientation` there: `role="group"` doesn't support it (axe `aria-allowed-attr`).
const isNested = !!inject(toolbarContextKey, null)

const ui = useComponentUI('toolbar', theme, () => ({
  orientation: props.orientation,
  attached: props.attached,
}))

provide(toolbarContextKey, {
  orientation: toRef(() => props.orientation),
  ui,
  uiOverrides: toRef(() => props.ui),
})

const root = ref<{ $el: HTMLElement }>()

const FOCUSABLE = [
  'input:not([disabled]):not([type=hidden])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  'area[href]',
  'summary',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable^="false"])',
  '[tabindex]',
].join(',')

const focusable = (el: HTMLElement) => {
  return [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (node) => !node.closest('[inert]') && node.getClientRects().length > 0,
  )
}

const move = (el: HTMLElement, step: 1 | -1, edge?: 'first' | 'last') => {
  const nodes = focusable(el)
  if (nodes.length === 0) return

  if (edge) {
    nodes[edge === 'first' ? 0 : nodes.length - 1]!.focus()
    return
  }

  const active = document.activeElement as HTMLElement | null
  const index = active ? nodes.indexOf(active) : -1

  // No wrapping: focus stays on the first/last control (React Aria's focus manager default).
  const next = index === -1 ? (step === 1 ? nodes[0] : undefined) : nodes[index + step]
  next?.focus()
}

// Remembers the control focused when Tab left the toolbar, so focus returns there on re-entry.
let lastFocused: HTMLElement | null = null

const onKeydown = (event: KeyboardEvent) => {
  const el = root.value?.$el
  if (!el || !el.contains(event.target as Node)) return
  const reverse = props.orientation === 'horizontal' && getComputedStyle(el).direction === 'rtl'
  const forward = props.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  const backward = props.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  if (event.key === forward) {
    move(el, reverse ? -1 : 1)
  } else if (event.key === backward) {
    move(el, reverse ? 1 : -1)
  } else if (event.key === 'Tab') {
    // Jump to the edge and let the browser's Tab carry focus out of the toolbar.
    lastFocused = document.activeElement as HTMLElement | null
    move(el, 1, event.shiftKey ? 'first' : 'last')

    return
  } else {
    return
  }

  event.stopPropagation()
  event.preventDefault()
}

const onFocusout = (event: FocusEvent) => {
  const el = root.value?.$el
  if (el && !el.contains(event.relatedTarget as Node | null) && !lastFocused)
    lastFocused = event.target as HTMLElement
}

const onFocusin = (event: FocusEvent) => {
  const el = root.value?.$el
  if (
    lastFocused &&
    el &&
    !el.contains(event.relatedTarget as Node | null) &&
    el.contains(event.target as Node)
  ) {
    lastFocused.focus()
    lastFocused = null
  }
}
</script>
