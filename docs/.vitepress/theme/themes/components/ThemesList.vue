<template>
  <ScrollShadow
    hide-scroll-bar
    class="w-full px-4 md:w-auto"
    orientation="horizontal"
    visibility="none"
  >
    <ListBox
      aria-label="Theme"
      class="flex w-max flex-row flex-nowrap gap-5"
      :items="items"
      :model-value="currentThemeId ?? null"
      selection-mode="single"
      @update:model-value="onSelectionChange"
    >
      <template #item="{ item }">
        <img
          :alt="item.label"
          height="48"
          width="48"
          :src="images[item.value]"
          class="size-12 rounded-full bg-surface group-data-[selected=true]:ring-2 group-data-[selected=true]:ring-accent group-data-[selected=true]:ring-offset-2 group-data-[selected=true]:ring-offset-surface"
        />
        <span
          class="text-[10px] font-medium text-muted capitalize group-data-[selected=true]:text-foreground"
        >
          {{ item.label }}
        </span>
      </template>
    </ListBox>
  </ScrollShadow>
</template>

<script setup lang="ts">
import { ListBox, ScrollShadow } from '@hareui/vue'
import { computed } from 'vue'

import { useVariablesState } from '../composables/variables'
// Port of HeroUI docs `themes/components/themes-list.tsx`.
import type { ThemeId } from '../constants'
import { findMatchingTheme, themeValuesById, themes } from '../constants'

const [variables, setVariables] = useVariablesState()
const currentThemeId = computed(() => findMatchingTheme(variables.value))

const items = themes.map((theme) => ({
  value: theme.id,
  label: theme.label,
  textValue: theme.id,
  class:
    'group relative flex w-12 shrink-0 flex-col items-center justify-center gap-1.5 p-0 hover:bg-transparent data-[hovered=true]:bg-transparent',
}))
const images = Object.fromEntries(themes.map((theme) => [theme.id, theme.image]))

function applyTheme(themeId: ThemeId) {
  const themeValues = themeValuesById[themeId]

  setVariables({
    base: themeValues.base,
    chroma: themeValues.chroma,
    fontFamily: themeValues.fontFamily,
    formRadius: themeValues.formRadius,
    hue: themeValues.hue,
    lightness: themeValues.lightness,
    radius: themeValues.radius,
  })
}

function onSelectionChange(selected: unknown) {
  if (typeof selected === 'string') applyTheme(selected as ThemeId)
}
</script>
