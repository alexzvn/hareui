<template>
  <Primitive
    ref="root"
    :as="as"
    data-slot="marquee"
    :data-orientation="orientation"
    :data-reverse="reverse ? '' : undefined"
    :data-pause-on-hover="pauseOnHover ? '' : undefined"
    :class="ui.root()"
  >
    <div
      v-for="index in repeat"
      :key="index"
      data-slot="marquee-content"
      :aria-hidden="index > 1 ? 'true' : undefined"
      :class="ui.content()"
    >
      <slot />
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type { MarqueeProps, MarqueeSlots } from './Marquee.types'
import theme from './theme'

const props = withDefaults(defineProps<MarqueeProps>(), {
  as: 'div',
  orientation: 'horizontal',
  repeat: 4,
  overlay: true,
})

defineSlots<MarqueeSlots>()

const ui = useComponentUI('marquee', {
  theme: theme,
  variantProps: () => ({
    orientation: props.orientation,
    pauseOnHover: props.pauseOnHover,
    reverse: props.reverse,
    overlay: props.overlay,
  }),
  props,
  classSlot: 'root',
})

const FOCUSABLE =
  'a[href], button, input, select, textarea, summary, iframe, [contenteditable], [tabindex]'

const root = useTemplateRef<InstanceType<typeof Primitive>>('root')

// Copies after the first are `aria-hidden`; their focusable elements leave the tab order so keyboard and screen
// reader users meet each link or button once. `inert` would also block pointer clicks on the copies.
const removeCopiesFromTabOrder = () => {
  const el = root.value?.$el as HTMLElement | undefined
  if (!el) return

  for (const copy of el.querySelectorAll('[data-slot="marquee-content"][aria-hidden="true"]')) {
    for (const focusable of copy.querySelectorAll(FOCUSABLE))
      focusable.setAttribute('tabindex', '-1')
  }
}

let observer: MutationObserver | undefined

onMounted(() => {
  removeCopiesFromTabOrder()
  const el = root.value?.$el as HTMLElement | undefined
  if (!el || typeof MutationObserver === 'undefined') return

  observer = new MutationObserver(removeCopiesFromTabOrder)
  observer.observe(el, { childList: true, subtree: true })
})

onBeforeUnmount(() => observer?.disconnect())
</script>
