<template>
  <div v-if="mode === 'page'" ref="root" class="w-full">
    <div
      class="max-w-full overflow-hidden rounded-xl border border-separator"
      :style="{ height, width: width === undefined ? '100%' : `${width + 2}px` }"
    >
      <iframe
        v-if="src"
        ref="iframe"
        :data-preview-theme="theme"
        :src="src"
        :title="`${name} preview`"
        :class="[
          'block size-full border-0 bg-transparent transition-opacity duration-150 ease-out motion-reduce:transition-none',
          !ready && 'opacity-0',
        ]"
      />
    </div>
  </div>
  <div
    v-else
    class="absolute inset-y-0 start-0"
    :style="{ width: width === undefined ? '100%' : `${width}px` }"
  >
    <iframe
      v-if="src"
      ref="iframe"
      :data-preview-theme="theme"
      :src="src"
      :title="`${name} preview`"
      :class="['block size-full border-0 bg-transparent', !(ready && visible) && 'opacity-0']"
      :inert="!(ready && visible)"
    />
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import { onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue'

import { demoPreviewPath, isPreviewReadyMessage, type PreviewTheme } from '../demos'

/**
 * Renders a demo's standalone `/preview/<name>` page in an iframe at a given viewport width (1:1, never scaled), so
 * `md:`/`lg:` breakpoints, fixed layouts and overlays behave as in an app. The frame is left-aligned, as on heroui.pro.
 * - `page` (`ComponentPreview contain`): a bordered frame of `height`; it loads once it nears the viewport and fades
 *   its demo in.
 * - `inline`: covers the plain preview box it's placed in (which keeps its height), inside the box's borders. It loads
 *   on mount and stays invisible until `visible` and the preview page reports its demo rendered, so the box swaps from
 *   its inline render to the frame in one paint.
 */
const props = withDefaults(
  defineProps<{
    name: string
    theme: PreviewTheme
    mode: 'page' | 'inline'
    /** Viewport width (px); `undefined` fills the row. */
    width?: number
    /** `page` mode: frame height (CSS length). */
    height?: string
    /** `inline` mode: show the iframe once it's ready. */
    visible?: boolean
  }>(),
  { visible: true },
)
const emit = defineEmits<{ ready: [] }>()

// The preview page takes its theme from the frame's `data-preview-theme` (and the design preset from this page's
// `<html>`) before its first paint and then live, so the src carries no theme and is set once.
const iframe = useTemplateRef<HTMLIFrameElement>('iframe')
const src = shallowRef<string>()
const ready = ref(false)
const onMessage = (event: MessageEvent) => {
  if (
    !iframe.value ||
    event.source !== iframe.value.contentWindow ||
    !isPreviewReadyMessage(event.data)
  )
    return
  ready.value = true
  emit('ready')
}

const root = useTemplateRef<HTMLElement>('root')
let visibilityObserver: IntersectionObserver | undefined
const load = () => {
  src.value = withBase(demoPreviewPath(props.name))
}
onMounted(() => {
  window.addEventListener('message', onMessage)
  // `inline` frames mount on demand. `page` frames boot the demo only once they near the viewport: a page can hold a
  // dozen of them, and each is a whole app.
  if (props.mode === 'inline' || !root.value) return load()
  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      visibilityObserver?.disconnect()
      load()
    },
    { rootMargin: '200px 0px' },
  )
  visibilityObserver.observe(root.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  visibilityObserver?.disconnect()
})
</script>
