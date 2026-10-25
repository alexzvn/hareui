<template>
  <Primitive
    ref="root"
    :as="as"
    :role="isNested ? 'group' : 'toolbar'"
    :aria-orientation="isNested ? undefined : orientation"
    data-slot="toolbar"
    :data-orientation="orientation"
    :class="ui.base()"
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
import { inject, provide, toRef, useTemplateRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { toolbarContextKey } from './context'
import theme from './theme'
import type { ToolbarProps, ToolbarSlots } from './Toolbar.types'

const props = withDefaults(defineProps<ToolbarProps>(), { as: 'div', orientation: 'horizontal' })
defineSlots<ToolbarSlots>()

// A toolbar inside another toolbar is a plain group; the outer one owns arrow-key navigation (React Aria `useToolbar`).
// Unlike React Aria it drops `aria-orientation` there: `role="group"` doesn't support it (axe `aria-allowed-attr`).
const isNested = !!inject(toolbarContextKey, null)

const ui = useComponentUI('toolbar', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    attached: props.attached,
  }),
  props,
})

provide(toolbarContextKey, {
  orientation: toRef(() => props.orientation),
  ui,
})

const root = useTemplateRef<{ $el: HTMLElement }>('root')

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

const focusEdge = (el: HTMLElement, edge: 'first' | 'last') => {
  const nodes = focusable(el)
  const target = edge === 'first' ? nodes[0] : nodes.at(-1)
  target?.focus()
}

const move = (el: HTMLElement, step: number) => {
  const nodes = focusable(el)
  const active = document.activeElement as HTMLElement | null
  const index = active ? nodes.indexOf(active) : -1

  // No wrapping: focus stays on the first/last control (React Aria's focus manager default).
  if (index !== -1) {
    nodes[index + step]?.focus()
    return
  }

  if (step === 1) nodes[0]?.focus()
}

// Arrow keys that move focus along each orientation, as a step in DOM order (before RTL flipping).
const ARROW_STEPS: Record<'horizontal' | 'vertical', Partial<Record<string, 1 | -1>>> = {
  horizontal: { ArrowRight: 1, ArrowLeft: -1 },
  vertical: { ArrowDown: 1, ArrowUp: -1 },
}

// Remembers the control focused when Tab left the toolbar, so focus returns there on re-entry.
let lastFocused: HTMLElement | null = null

const onKeydown = (event: KeyboardEvent) => {
  const el = root.value?.$el
  if (!el || !el.contains(event.target as Node)) return

  if (event.key === 'Tab') {
    // Jump to the edge and let the browser's Tab carry focus out of the toolbar.
    lastFocused = document.activeElement as HTMLElement | null
    focusEdge(el, event.shiftKey ? 'first' : 'last')

    return
  }

  const step = ARROW_STEPS[props.orientation][event.key]
  if (!step) return

  const isReversed = props.orientation === 'horizontal' && getComputedStyle(el).direction === 'rtl'
  move(el, isReversed ? -step : step)
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
