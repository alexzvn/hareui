<template>
  <div class="flex flex-col gap-1">
    <Label>Theme</Label>
    <Popover side="top" class="w-[228px] rounded-3xl" :ui="{ dialog: 'p-4' }">
      <ControlsPopoverTrigger>
        <InputGroup
          class="w-40 cursor-pointer"
          id="theme"
          name="theme"
          readonly
          :model-value="currentTheme?.label ?? 'Custom'"
          :ui="{ prefix: 'w-10', input: 'max-w-20 cursor-pointer capitalize', suffix: 'w-10' }"
        >
          <template #prefix>
            <Icon icon="gravity-ui:bucket-paint" />
          </template>
          <template #suffix>
            <Icon icon="gravity-ui:chevrons-expand-vertical" class="size-3" />
          </template>
        </InputGroup>
      </ControlsPopoverTrigger>
      <template #content>
        <ListBox
          aria-label="Theme"
          class="grid grid-cols-4 gap-3"
          :items="items"
          :model-value="currentThemeId ?? null"
          selection-mode="single"
          @update:model-value="onSelectionChange"
        >
          <template #item="{ item }">
            <img
              :alt="item.label"
              height="36"
              width="36"
              :src="images[item.value]"
              class="size-9 rounded-full bg-surface group-data-[selected=true]:ring-2 group-data-[selected=true]:ring-accent group-data-[selected=true]:ring-offset-2 group-data-[selected=true]:ring-offset-surface"
            />
            <span
              class="text-[10px] font-medium text-muted capitalize group-data-[selected=true]:text-foreground"
            >
              {{ item.label }}
            </span>
          </template>
        </ListBox>
        <div class="mt-4 border-t border-separator pt-4">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-0.5">
              <Label class="text-xs">Vibrant palette</Label>
              <Description class="text-[10px]">More saturated, less contrast</Description>
            </div>
            <Switch
              :model-value="variables.vibrantPalette ?? false"
              @update:model-value="setVariables({ vibrantPalette: $event })"
            />
          </div>
        </div>
        <p class="mt-4 text-xs text-muted">
          Press
          <Kbd>T</Kbd>
          to pick random
        </p>
      </template>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Description, InputGroup, Kbd, Label, ListBox, Popover, Switch } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

import { useKeyPress } from '../composables/keyPress'
import { useVariablesState } from '../composables/variables'
// Port of HeroUI docs `themes/components/theme-popover.tsx`.
import type { ThemeId } from '../constants'
import { findMatchingTheme, themeValuesById, themes } from '../constants'
import ControlsPopoverTrigger from './ControlsPopoverTrigger.vue'

const [variables, setVariables] = useVariablesState()
const currentThemeId = computed(() => findMatchingTheme(variables.value))
const currentTheme = computed(() =>
  currentThemeId.value ? themes.find((t) => t.id === currentThemeId.value) : undefined,
)

const items = themes.map((theme) => ({
  value: theme.id,
  label: theme.label,
  textValue: theme.id,
  class:
    'group relative flex w-10 flex-col items-center justify-center gap-1.5 p-0 hover:bg-transparent data-[hovered=true]:bg-transparent',
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

function randomizeTheme() {
  const randomTheme = themes[Math.floor(Math.random() * themes.length)]

  if (randomTheme) {
    applyTheme(randomTheme.id)
  }
}

useKeyPress('t', randomizeTheme)

function onSelectionChange(selected: unknown) {
  if (typeof selected === 'string') applyTheme(selected as ThemeId)
}
</script>
