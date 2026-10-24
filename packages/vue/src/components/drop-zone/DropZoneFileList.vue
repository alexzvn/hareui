<template>
  <TransitionGroup
    tag="div"
    data-slot="drop-zone-file-list"
    move-class="transition-transform! duration-250! ease-out! motion-reduce:transition-none!"
    :css="false"
    :class="ui.fileList({ class: [context?.ui.value?.fileList, props.ui?.fileList, props.class] })"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot />
  </TransitionGroup>
</template>

<script lang="ts">
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

export interface DropZoneFileListProps {
  /** Additional classes merged into the list element. */
  class?: any
  /** Per-slot class overrides. Merged after the surrounding DropZone's `ui`. */
  ui?: Pick<ComponentSlots<typeof theme>, 'fileList'>
}

export interface DropZoneFileListSlots {
  /** The `DropZoneFileItem`s. Give each a unique `key` so they animate in and out. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { inject } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { dropZoneContextKey } from './context'

const props = defineProps<DropZoneFileListProps>()
defineSlots<DropZoneFileListSlots>()

const context = inject(dropZoneContextKey, null)
const ui = useComponentUI('dropZone', theme, () => ({}))

function animate(
  el: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  done: () => void,
) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduced || typeof (el as HTMLElement).animate !== 'function') {
    done()
    return
  }
  const animation = (el as HTMLElement).animate(keyframes, options)
  animation.onfinish = done
  animation.oncancel = done
}

function onEnter(el: Element, done: () => void) {
  animate(
    el,
    [
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 300, easing: 'ease-out' },
    done,
  )
}

// Leaving items are taken out of the flow at their current spot, so the remaining items slide into place right away
function onLeave(el: Element, done: () => void) {
  const item = el as HTMLElement
  const { offsetTop, offsetLeft, offsetWidth } = item
  Object.assign(item.style, {
    position: 'absolute',
    top: `${offsetTop}px`,
    left: `${offsetLeft}px`,
    width: `${offsetWidth}px`,
    margin: '0',
  })
  animate(item, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out' }, done)
}
</script>
