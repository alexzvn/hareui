<script setup lang="ts">
// Port of HeroUI docs `themes/components/theme-input.tsx`.
import { Icon } from '@iconify/vue'
import { Avatar, InputGroup } from 'herouse'
import { computed } from 'vue'
import { useVariablesState } from '../composables/variables'
import { findMatchingTheme, themes } from '../constants'

const [variables] = useVariablesState()
const currentThemeId = computed(() => findMatchingTheme(variables.value))
const currentTheme = computed(() => currentThemeId.value ? themes.find(t => t.id === currentThemeId.value) : undefined)

const customThemeGradient = computed(() => {
  const accentColor = `oklch(${variables.value.lightness} ${variables.value.chroma} ${variables.value.hue})`
  return `radial-gradient(85.29% 80.57% at 40.28% 34.72%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.02) 43.66%, rgba(0, 0, 0, 0.27) 72.4%, rgba(0, 0, 0, 0.30) 100%), ${accentColor}`
})
</script>

<template>
  <InputGroup
    class="w-full cursor-pointer"
    readonly
    :model-value="currentTheme?.label ?? 'Custom'"
    :ui="{ prefix: 'w-10', input: 'max-w-20 sm:max-w-none', suffix: 'flex w-10 flex-1 justify-end' }"
  >
    <template #prefix>
      <Avatar
        v-if="currentTheme"
        class="size-4"
        :src="currentTheme.image"
        :alt="currentTheme.label"
        :fallback="currentTheme.label[0]"
      />
      <div v-else class="size-4 rounded-full" :style="{ background: customThemeGradient }" />
    </template>
    <template #suffix>
      <Icon icon="gravity-ui:chevrons-expand-vertical" class="size-4" />
    </template>
  </InputGroup>
</template>
