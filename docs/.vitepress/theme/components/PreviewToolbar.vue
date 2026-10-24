<template>
  <div class="not-prose flex items-center justify-end px-0.5 pb-3">
    <div class="flex min-w-0 items-center gap-1">
      <button
        type="button"
        aria-label="Toggle preview theme"
        :class="iconButtonClass"
        @click="emit('toggleTheme')"
      >
        <span class="flex" v-html="icon(theme === 'dark' ? 'sun' : 'moon')" />
      </button>
      <a
        aria-label="Open in new tab"
        :class="iconButtonClass"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="flex" v-html="icon('arrow-up-right')" />
      </a>
      <div aria-hidden="true" class="mx-1 hidden h-5 w-px shrink-0 bg-separator md:block" />
      <div
        ref="group"
        role="radiogroup"
        aria-label="Preview device"
        class="relative isolate hidden h-8 shrink-0 items-center rounded-full bg-default p-0.5 md:flex"
        @keydown="onSegmentKeydown"
        @pointerenter="emit('preload')"
        @focusin="emit('preload')"
      >
        <span
          v-if="indicator"
          aria-hidden="true"
          :class="[
            'absolute start-0 top-0.5 -z-1 h-7 rounded-full bg-segment shadow-surface',
            sliding &&
              '[transition-duration:250ms] [transition-property:translate,width] [transition-timing-function:var(--ease-out-fluid)] motion-reduce:transition-none',
          ]"
          :style="{ width: `${indicator.width}px`, translate: `${indicator.x}px 0` }"
        />
        <button
          v-for="item in DEVICES"
          ref="items"
          :key="item.value"
          type="button"
          role="radio"
          :aria-checked="device === item.value"
          :tabindex="device === item.value ? 0 : -1"
          class="flex h-7 cursor-(--cursor-interactive) items-center rounded-full px-2.5 text-xs font-medium text-muted outline-none transition-[color,opacity] duration-150 focus-visible:status-focused aria-checked:text-segment-foreground motion-reduce:transition-none [@media(hover:hover)]:[&:not([aria-checked=true]):hover]:opacity-70"
          @click="select(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export type PreviewDevice = 'mobile' | 'tablet' | 'desktop'
</script>

<script setup lang="ts">
import gravity from '@iconify-json/gravity-ui/icons.json'
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

import type { PreviewTheme } from '../demos'

/**
 * HeroUI Pro's block-preview toolbar: theme toggle, open-in-new-tab, and a Mobile | Tablet | Desktop segmented control.
 * A dragged custom width keeps the last preset selected (as on heroui.pro); `preset` fires on every pick, even of the
 * selected one, so the preview can drop the custom width. `preload` fires once the pointer or focus reaches the switch.
 */
defineProps<{
  /** Standalone page of the demo. */
  href: string
  /** Theme the preview currently shows. */
  theme: PreviewTheme
}>()

const emit = defineEmits<{ toggleTheme: []; preset: [device: PreviewDevice]; preload: [] }>()
const device = defineModel<PreviewDevice>('device', { required: true })
const select = (value: PreviewDevice) => {
  device.value = value
  emit('preset', value)
}

const DEVICES: { value: PreviewDevice; label: string }[] = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'desktop', label: 'Desktop' },
]

// HeroUI `Segment` (size sm): a radiogroup whose selected pill slides between items.
const items = useTemplateRef<HTMLButtonElement[]>('items')
const indicator = ref<{ x: number; width: number }>()

/** The pill slides only when the device changes; layout remeasures (fonts, resize, unhiding) snap it in place. */
const sliding = ref(false)

const measureIndicator = () => {
  const item = items.value?.[DEVICES.findIndex((d) => d.value === device.value)]
  if (!item?.offsetWidth || !group.value) return

  // Fractional geometry: offsetLeft/offsetWidth round, leaving the pill up to half a pixel off its item.
  const rect = item.getBoundingClientRect()
  indicator.value = { x: rect.left - group.value.getBoundingClientRect().left, width: rect.width }
}

// The group is hidden below `md` (items measure 0) and its font may load late: remeasure whenever it resizes.
const group = useTemplateRef<HTMLElement>('group')
let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    sliding.value = false
    measureIndicator()
  })

  if (group.value) resizeObserver.observe(group.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

watch(device, () => {
  sliding.value = true
  nextTick(measureIndicator)
})

const onSegmentKeydown = (event: KeyboardEvent) => {
  const step = (
    { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>
  )[event.key]

  if (!step) return
  event.preventDefault()

  const index =
    (DEVICES.findIndex((d) => d.value === device.value) + step + DEVICES.length) % DEVICES.length

  select(DEVICES[index].value)
  items.value?.[index]?.focus()
}

const icon = (name: 'moon' | 'sun' | 'arrow-up-right') =>
  `<svg aria-hidden="true" class="size-3.5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">${gravity.icons[name].body}</svg>`

const iconButtonClass =
  'flex size-7 cursor-(--cursor-interactive) items-center justify-center rounded-lg text-muted outline-none transition-colors hover:bg-default hover:text-foreground focus-visible:status-focused motion-reduce:transition-none'
</script>
