<template>
  <p v-if="!demo" class="text-danger">Demo not found: {{ name }}</p>
  <div
    v-else
    class="component-preview-container group relative my-4 w-full"
    :data-name="dataName"
    style="contain: content"
  >
    <PreviewToolbar
      v-model:device="device"
      :href="href"
      :theme="theme"
      @toggle-theme="toggleTheme"
      @preset="customWidth = undefined"
      @preload="preload"
    />
    <div v-if="paged" ref="stage" class="relative">
      <DevicePreview
        mode="page"
        :name="name"
        :height="frameHeight"
        :width="viewport"
        :theme="theme"
      />
      <PreviewResizeHandle
        v-model:dragging="dragging"
        :width="viewport ?? fullWidth"
        :min="minWidth"
        :max="fullWidth"
        :edge="pageEdge"
        @resize="customWidth = $event"
      />
    </div>
    <div
      v-else
      ref="stage"
      :data-name="dataName"
      v-bind="scopeAttributes"
      :class="[
        'preview not-prose relative min-h-[350px] w-full overflow-hidden rounded-t-xl border-s border-e border-t border-separator bg-background p-4 text-foreground sm:p-10 flex',
        alignClass,
        pinnedTheme,
      ]"
      @pointerdown.capture="claimOverlays"
      @keydown.capture="claimOverlays"
    >
      <div
        :class="['isolate flex w-full', alignClass, frameShown && 'invisible']"
        :style="minHeight ? { minHeight } : undefined"
      >
        <component :is="demo" />
      </div>
      <DevicePreview
        v-if="frameMounted"
        mode="inline"
        :name="name"
        :width="viewport"
        :theme="theme"
        :visible="frameVisible"
        @ready="frameReady = true"
      />
      <div
        v-if="displayWidth !== undefined && displayWidth < fullWidth"
        aria-hidden="true"
        class="absolute inset-y-0 end-0 z-1 border-s border-separator bg-background"
        :style="{ left: `${displayWidth}px` }"
      />
      <PreviewResizeHandle
        v-model:dragging="dragging"
        :width="viewport ?? fullWidth"
        :min="minWidth"
        :max="fullWidth"
        :edge="displayWidth"
        @resize="customWidth = $event"
        @preload="preload"
      />
    </div>
    <div
      :class="[
        'code-section relative border border-separator bg-transparent',
        paged ? 'mt-4 rounded-xl' : 'rounded-b-xl',
      ]"
    >
      <div class="code-block-wrapper">
        <div class="relative">
          <div class="relative">
            <div
              :class="[
                'code-block-wrapper relative',
                !expanded && 'mask-to-bottom max-h-[150px] overflow-hidden',
              ]"
            >
              <figure
                dir="ltr"
                class="my-4 bg-fd-card rounded-xl shiki relative border not-prose overflow-hidden text-sm docs-code-block shadow-none docs-code-block-line-numbers"
                lang="vue"
                tabindex="-1"
              >
                <div
                  class="z-1! empty:hidden absolute top-3 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground"
                >
                  <button
                    aria-label="Copy Text"
                    type="button"
                    :class="copyClass"
                    @click="copy"
                    v-html="copyIcon"
                  />
                </div>
                <div
                  role="region"
                  tabindex="0"
                  class="text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring"
                  style="--padding-right: calc(var(--spacing) * 8)"
                >
                  <pre
                    class="min-w-full w-max *:flex *:flex-col shiki shiki-themes github-light github-dark"
                    style="
                      --shiki-light: #24292e;
                      --shiki-dark: #e1e4e8;
                      --shiki-light-bg: #fff;
                      --shiki-dark-bg: #24292e;
                    "
                    tabindex="0"
                  ><code v-if="codeHtml" v-html="codeHtml" /><code v-else><span v-for="(line, i) in source?.split('\n')" :key="i" class="line">{{ line }}</span></code></pre>
                </div>
              </figure>
            </div>
            <button
              type="button"
              data-slot="button"
              :class="expandClass"
              @click="expanded = !expanded"
            >
              {{ expanded ? 'Collapse code' : 'Expand code' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hareUIConfigKey, type HareUIConfig } from '@hareui/vue'
import gravity from '@iconify-json/gravity-ui/icons.json'
import { withBase } from 'vitepress'
import {
  computed,
  defineAsyncComponent,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'

import buttonTheme from '../../../../packages/vue/src/components/button/theme'
import { tv } from '../../../../packages/vue/src/utils/tv'
import { flashCopied } from '../composables/useDocInteractions'
import { DESIGN_ATTRIBUTES, useDocTheme } from '../composables/useDocTheme'
import { demoLoader, demoPreviewPath, previewOverlayTheme, type PreviewTheme } from '../demos'
import DevicePreview from './DevicePreview.vue'
import PreviewResizeHandle from './PreviewResizeHandle.vue'
import PreviewToolbar, { type PreviewDevice } from './PreviewToolbar.vue'

const props = withDefaults(
  defineProps<{
    name: string
    align?: 'center' | 'start' | 'end'
    minHeight?: string
    /** Full-page demo (fixed layouts, overlays): always render it in an iframe of this height; bare `contain` uses 26rem. */
    contain?: boolean | string
    /** The device the preview starts on. */
    device?: PreviewDevice
  }>(),
  {
    align: 'center',
    contain: false,
    device: 'desktop',
  },
)

const frameHeight = computed(() =>
  props.contain === false
    ? undefined
    : props.contain === true || props.contain === ''
      ? '26rem'
      : props.contain,
)

/** The demo renders in a fixed-height iframe rather than the plain preview box. */
const paged = frameHeight.value !== undefined

// Same breakpoint as the toolbar's `md:` device switch and the resize handle: below it (as on heroui.pro) the preview
// is always the column width.
const compact = ref(false)
let compactQuery: MediaQueryList | undefined
const onCompactChange = () => (compact.value = !compactQuery!.matches)

const device = ref<PreviewDevice>(props.device)

// The preview follows the docs theme (and its design preset) unless the toolbar pins the other one; a docs theme change
// drops the pin, so the toggle and the page can't drift apart.
const { dark: docDark, design } = useDocTheme()
const pageTheme = computed<PreviewTheme>(() => (docDark.value ? 'dark' : 'light'))
const pinnedTheme = ref<PreviewTheme>()
const theme = computed(() => pinnedTheme.value ?? pageTheme.value)
watch(pageTheme, () => (pinnedTheme.value = undefined))

const toggleTheme = () => {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  pinnedTheme.value = next === pageTheme.value ? undefined : next
}

/** Scopes a pinned theme to the box (and its overlays): `.light`/`.dark` plus the preset attributes, which the preset
 * rules need on the same element. Unpinned, the box inherits `<html>`, so the SSR markup is right before hydration. */
const scopeAttributes = computed(() => (pinnedTheme.value ? design.value : {}))
const href = computed(() => `${withBase(demoPreviewPath(props.name))}?theme=${theme.value}`)

// Widths are viewport widths (the iframe's, inside the frame's borders), always rendered 1:1. Desktop is the whole row;
// a preset narrower than the row, or a dragged width (which keeps the preset selected, as on heroui.pro), is capped
// at it.
const PRESETS: Partial<Record<PreviewDevice, number>> = { mobile: 375, tablet: 768 }
const MIN_WIDTH = 320
const stage = useTemplateRef<HTMLElement>('stage')

/** The Desktop viewport width: the box inside its side borders, or the row minus the page frame's borders. */
const fullWidth = ref(0)
const customWidth = ref<number>()
const minWidth = computed(() => Math.min(MIN_WIDTH, fullWidth.value))

/** `undefined`: the frame fills the row (not measured yet, or a phone-sized docs page). */
const viewport = computed(() => {
  if (compact.value || !fullWidth.value) return undefined
  const target = customWidth.value ?? PRESETS[device.value] ?? fullWidth.value

  return Math.min(fullWidth.value, Math.max(minWidth.value, target))
})

const narrow = computed(() => viewport.value !== undefined && viewport.value < fullWidth.value)
const dragging = ref(false)
const pageEdge = computed(() => (narrow.value ? viewport.value! + 2 : undefined))

let stageObserver: ResizeObserver | undefined
onMounted(() => {
  compactQuery = window.matchMedia('(min-width: 48rem)')
  onCompactChange()
  compactQuery.addEventListener('change', onCompactChange)

  stageObserver = new ResizeObserver(() => {
    if (stage.value) fullWidth.value = stage.value.clientWidth - (paged ? 2 : 0)
  })

  if (stage.value) stageObserver.observe(stage.value)
})

onBeforeUnmount(() => {
  compactQuery?.removeEventListener('change', onCompactChange)
  stageObserver?.disconnect()
})

// A plain preview renders inline at Desktop, in its own theme (`.light`/`.dark` on the box scopes the tokens and the
// `dark:` variant), so a theme switch never needs an iframe. Narrower, the demo needs a real viewport for its
// breakpoints: the box mounts the standalone page in an iframe over itself, invisible until it reports its demo
// rendered, then swaps from the inline render (which keeps the box height) to it in one paint. The iframe stays
// mounted once loaded, so later swaps are instant; hovering the device switch or the handle preloads it.
const frameMounted = ref(false)
const frameReady = ref(false)
const frameVisible = computed(() => narrow.value || dragging.value)
watchEffect(() => {
  if (!paged && frameVisible.value) frameMounted.value = true
})

const preload = () => {
  if (!paged && !compact.value) frameMounted.value = true
}

const frameShown = computed(() => frameReady.value && frameVisible.value)

/** Where the frame's right edge shows: dragging moves it with the pointer even before the iframe is ready. */
const displayWidth = computed(() =>
  frameShown.value || dragging.value ? viewport.value : undefined,
)

// Overlays opened from an inline preview pinned to the other theme portal into a body-level element scoped like the
// box; the docs-wide toast region (Layout.vue) follows the preview last interacted with.
const overlayScoped = computed(() => !paged && pinnedTheme.value !== undefined)
const portalTarget = shallowRef<HTMLElement>()
watchEffect(() => {
  if (!portalTarget.value && overlayScoped.value) {
    const target = markRaw(document.createElement('div'))
    target.dataset.previewPortal = props.name
    document.body.append(target)
    portalTarget.value = target
  }

  const target = portalTarget.value
  if (!target) return

  // `text-foreground`: overlays inherit their text colour, which body sets from the docs theme.
  target.className = `${theme.value} text-foreground`

  for (const name of DESIGN_ATTRIBUTES) {
    const value = scopeAttributes.value[name]
    if (value === undefined) target.removeAttribute(name)
    else target.setAttribute(name, value)
  }
})

onBeforeUnmount(() => portalTarget.value?.remove())
const parentConfig = inject(hareUIConfigKey, {})
provide(hareUIConfigKey, {
  get ui() {
    return parentConfig.ui
  },
  get portal() {
    return overlayScoped.value ? portalTarget.value : parentConfig.portal
  },
} satisfies HareUIConfig)

const claimOverlays = () => {
  previewOverlayTheme.value = overlayScoped.value ? theme.value : undefined
}

const sources = import.meta.glob<string>('../../../demos/**/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const source = computed(() => sources[`../../../demos/${props.name}.vue`])

if (import.meta.env.SSR && !demoLoader(props.name)) {
  throw new Error(`ComponentPreview: demo not found: docs/demos/${props.name}.vue`)
}

const demo = computed(() => {
  const loader = demoLoader(props.name)
  return loader ? defineAsyncComponent(loader) : undefined
})

const highlighted = new Map<string, Promise<string>>()
const highlight = (name: string, code: string): Promise<string> => {
  let cached = highlighted.get(name)
  if (!cached) {
    cached = import('shiki').then(({ codeToHtml }) =>
      codeToHtml(code, {
        lang: 'vue',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      }),
    )

    highlighted.set(name, cached)
  }

  return cached
}

const codeHtml = shallowRef<string>()
onMounted(async () => {
  if (!source.value) return
  const html = await highlight(props.name, source.value)
  codeHtml.value = html.match(/<code[^>]*>([\s\S]*)<\/code>/)?.[1]
})

const expanded = ref(false)

const button = tv(buttonTheme)
const copyClass = button({ variant: 'ghost', size: 'sm', iconOnly: true }).base({
  class: '-mt-0.5 bg-transparent text-muted',
})

const expandClass = button({ variant: 'tertiary', size: 'sm' }).base({
  class: 'absolute end-1/2 bottom-2 translate-x-1/2 bg-surface text-xs shadow-sm shadow-black/5',
})

const copyIcon = `<svg aria-hidden="true" height="1em" role="img" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg">${gravity.icons.copy.body}</svg>`

const dataName = computed(() => props.name.replace(/\//g, '-'))

const alignClass = computed(
  () =>
    ({
      center: 'items-center justify-center',
      start: 'items-start justify-start',
      end: 'items-end justify-end',
    })[props.align],
)

const copy = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  if (source.value) void navigator.clipboard.writeText(source.value).then(() => flashCopied(target))
}
</script>
