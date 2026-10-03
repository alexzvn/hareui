<script setup lang="ts">
import type { LogoParams } from './geometry'
import { computed, useId } from 'vue'
import { fmt, logoPath } from './geometry'

const props = defineProps<{
  params: LogoParams
  size: number
  /** Extra canvas units around the 32-unit mark (favicon padding). */
  pad?: number
  /** Force a solid colour (e.g. white on an accent tile) instead of the selected fill. */
  solid?: string
}>()

const id = `logo-${useId()}`
const d = computed(() => logoPath(props.params))
const p = computed(() => props.pad ?? 0)
const fill = computed(() => {
  if (props.solid)
    return props.solid
  return { mono: 'currentColor', accent: 'var(--accent)', gradient: `url(#${id})`, duo: `url(#${id})` }[props.params.fill]
})
</script>

<template>
  <svg :height="size" :viewBox="`${-p} ${-p} ${32 + 2 * p} ${32 + 2 * p}`" :width="size" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient v-if="params.fill === 'gradient'" :id="id" x1="0" x2="1" y1="1" y2="0">
        <stop offset="0" stop-color="oklch(0.55 0.22 268)" />
        <stop offset="1" stop-color="oklch(0.75 0.15 225)" />
      </linearGradient>
      <linearGradient v-else-if="params.fill === 'duo'" :id="id" x1="0" x2="1" y1="1" y2="0">
        <stop offset=".5" style="stop-color: var(--accent)" />
        <stop offset=".5" style="stop-color: color-mix(in oklch, var(--accent) 55%, white)" />
      </linearGradient>
    </defs>
    <g :transform="`rotate(${fmt(params.tilt)} 16 16)`">
      <path :d="d" fill-rule="evenodd" :style="{ fill }" />
    </g>
    <slot />
  </svg>
</template>
