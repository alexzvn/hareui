<script setup lang="ts">
import ThemeColumn, { type SoftProps } from './color/ThemeColumn.vue'

defineProps<{
  name: string
  baseVariable: string
  baseTooltip?: string
  hoverVariable: string
  hoverCssValue?: string
  hoverTooltip?: string
  foregroundVariable: string
  foregroundTooltip?: string
  soft?: SoftProps
}>()
</script>

<template>
  <div class="not-prose flex flex-col gap-4 sm:flex-row">
    <ThemeColumn
      :base-tooltip="baseTooltip"
      :base-variable="baseVariable"
      :foreground-tooltip="foregroundTooltip"
      :foreground-variable="foregroundVariable"
      :hover-css-value="hoverCssValue"
      :hover-tooltip="hoverTooltip"
      :hover-variable="hoverVariable"
      :name="name"
      :soft="soft"
      theme="Light"
    />
    <ThemeColumn
      :base-tooltip="baseTooltip"
      :base-variable="baseVariable"
      :foreground-tooltip="foregroundTooltip"
      :foreground-variable="foregroundVariable"
      :hover-css-value="hoverCssValue"
      :hover-tooltip="hoverTooltip"
      :hover-variable="hoverVariable"
      :name="name"
      :soft="soft"
      theme="Dark"
    />
  </div>
</template>
