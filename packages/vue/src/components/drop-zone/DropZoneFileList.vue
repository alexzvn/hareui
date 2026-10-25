<template>
  <TransitionGroup
    tag="div"
    data-slot="drop-zone-file-list"
    move-class="transition-transform! duration-250! ease-out! motion-reduce:transition-none!"
    :css="false"
    :class="ui.fileList({ class: context?.ui.value?.fileList })"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot />
  </TransitionGroup>
</template>

<script setup lang="ts">
import { inject } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { dropZoneContextKey } from './context'
import type { DropZoneFileListProps, DropZoneFileListSlots } from './DropZoneFileList.types'
import theme from './theme'

const props = defineProps<DropZoneFileListProps>()
defineSlots<DropZoneFileListSlots>()

const context = inject(dropZoneContextKey, null)

const ui = useComponentUI('dropZone', {
  theme: theme,
  variantProps: () => ({}),
  props,
  classSlot: 'fileList',
})

type AnimateOptions = {
  keyframes: Keyframe[]
  timing: KeyframeAnimationOptions
  done: () => void
}

const animate = (el: Element, { keyframes, timing, done }: AnimateOptions) => {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (reduced || typeof (el as HTMLElement).animate !== 'function') {
    done()
    return
  }

  const animation = (el as HTMLElement).animate(keyframes, timing)
  animation.onfinish = done
  animation.oncancel = done
}

const onEnter = (el: Element, done: () => void) => {
  animate(el, {
    keyframes: [
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'none' },
    ],
    timing: { duration: 300, easing: 'ease-out' },
    done,
  })
}

// Leaving items are taken out of the flow at their current spot, so the remaining items slide into place right away
const onLeave = (el: Element, done: () => void) => {
  const item = el as HTMLElement
  const { offsetTop, offsetLeft, offsetWidth } = item
  Object.assign(item.style, {
    position: 'absolute',
    top: `${offsetTop}px`,
    left: `${offsetLeft}px`,
    width: `${offsetWidth}px`,
    margin: '0',
  })

  animate(item, {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    timing: { duration: 200, easing: 'ease-out' },
    done,
  })
}
</script>
