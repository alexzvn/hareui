<template>
  <div
    :class="[
      'flex min-h-dvh bg-background font-sans text-foreground',
      centered ? ['p-4 sm:p-10', alignClass] : 'flex-col',
    ]"
  >
    <Suspense v-if="demo" @resolve="announceReady">
      <div v-if="centered" :class="['flex w-full', alignClass]" :style="minHeight">
        <component :is="demo" />
      </div>
      <component :is="demo" v-else />
    </Suspense>
    <p v-else class="p-4 text-danger">Demo not found: {{ name }}</p>
    <!-- The docs shell's shared queue provider (Layout.vue): demos calling the global `toast()` need one here too. -->
    <ToastProvider />
  </div>
</template>

<script setup lang="ts">
import { ToastProvider } from '@hareui/vue'
import { useData } from 'vitepress'
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted } from 'vue'

import { DESIGN_ATTRIBUTES, readDesignAttributes } from '../composables/useDocTheme'
import { demoLoader, type PreviewReadyMessage } from '../demos'

/**
 * `/preview/<demo>`: one demo, full viewport, no docs chrome. ComponentPreview iframes it at a device or dragged width
 * (1:1), so the demo's breakpoints and fixed/overlay layers see a real viewport. Once the demo has rendered, the page
 * posts `hareui-preview-ready` to the embedding docs page, which then swaps its inline render for the frame.
 *
 * Theme: embedded, the docs page owns it. The frame's `data-preview-theme` and the parent `<html>`'s design attributes
 * are copied onto this page's `<html>`, before first paint by the head script in docs/preview/[name].md and then live,
 * so neither the stored appearance nor a stale URL can override the parent. Standalone (↗), `?theme=` pins light/dark
 * and the design preset comes from storage like on any docs page.
 */
const { params } = useData()
const name = computed(() => String(params.value?.name ?? ''))
const demo = computed(() => {
  const loader = demoLoader(name.value)
  return loader ? defineAsyncComponent(loader) : undefined
})
// `centered` demos are laid out exactly as in the docs preview box (padding, alignment, `minHeight`), so the box can
// swap between its inline render and this page without a jump; `page` demos (full layouts) fill the viewport.
const centered = computed(() => params.value?.layout === 'centered')
const alignClass = computed(
  () =>
    (
      { start: 'items-start justify-start', end: 'items-end justify-end' } as Record<string, string>
    )[String(params.value?.align)] ?? 'items-center justify-center',
)
const minHeight = computed(() =>
  params.value?.minHeight ? { minHeight: String(params.value.minHeight) } : undefined,
)

const syncTheme = () => {
  const root = document.documentElement
  const frame = window.frameElement
  const theme = frame
    ? frame.getAttribute('data-preview-theme')
    : new URLSearchParams(location.search).get('theme')
  // A no-op when unchanged, so observing our own class can't loop.
  if (theme === 'light' || theme === 'dark') root.classList.toggle('dark', theme === 'dark')
  if (!frame) return
  const design = readDesignAttributes(window.parent.document.documentElement)
  for (const name of DESIGN_ATTRIBUTES) {
    const value = design[name]
    if (root.getAttribute(name) === (value ?? null)) continue
    if (value === undefined) root.removeAttribute(name)
    else root.setAttribute(name, value)
  }
}

/** Tells the embedding page the demo is on screen: the frame painted after this rAF shows it. */
const announceReady = () => {
  if (window.parent === window) return
  requestAnimationFrame(() => {
    const message: PreviewReadyMessage = { type: 'hareui-preview-ready' }
    window.parent.postMessage(message, location.origin)
  })
}

let observer: MutationObserver | undefined
onMounted(() => {
  syncTheme()
  observer = new MutationObserver(syncTheme)
  // VitePress re-applies the stored appearance (on load, and when another tab or the parent changes it).
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  if (window.frameElement) {
    observer.observe(window.frameElement, {
      attributes: true,
      attributeFilter: ['data-preview-theme'],
    })
    observer.observe(window.parent.document.documentElement, {
      attributes: true,
      attributeFilter: [...DESIGN_ATTRIBUTES],
    })
  }
  if (!demo.value) announceReady()
})
onBeforeUnmount(() => observer?.disconnect())
</script>
