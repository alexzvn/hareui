<script setup lang="ts">
import { InputGroup, Popover } from '@hareui/vue'
// Port of HeroUI docs `themes/components/font-family-popover.tsx`.
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

import { useCustomFonts } from '../composables/customFonts'
import { useVariableSetter } from '../composables/variables'
import { fonts } from '../constants'
import { extractFontFamilyFromUrl, isCustomFontUrl } from '../utils/font-utils'
import ControlsPopoverTrigger from './ControlsPopoverTrigger.vue'
import CustomFonts from './CustomFonts.vue'
import LockableLabel from './LockableLabel.vue'
import SuggestedFonts from './SuggestedFonts.vue'

const { variables } = useVariableSetter()
const { customFonts } = useCustomFonts()
const mode = ref<'suggested' | 'custom'>('suggested')

// Find current font label - check predefined fonts first, then URL-based custom fonts
const currentFontLabel = computed(() => {
  const fontFamily = variables.value.fontFamily
  const currentSuggestedFont = fonts.find((f) => f.id === fontFamily)
  const currentUrlFontLabel = isCustomFontUrl(fontFamily)
    ? extractFontFamilyFromUrl(fontFamily)
    : null
  return currentSuggestedFont?.label ?? currentUrlFontLabel ?? 'Inter'
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <LockableLabel label="Font Family" variable="fontFamily" />
    <Popover side="top" class="w-[325px] rounded-3xl" :ui="{ dialog: 'p-3' }">
      <ControlsPopoverTrigger>
        <InputGroup
          class="w-40 cursor-pointer"
          id="font-family"
          name="font-family"
          readonly
          :model-value="currentFontLabel"
          :ui="{ prefix: 'w-10', input: 'max-w-20 cursor-pointer', suffix: 'w-10' }"
        >
          <template #prefix>
            <Icon icon="gravity-ui:font-case" />
          </template>
          <template #suffix>
            <Icon icon="gravity-ui:chevrons-expand-vertical" class="size-3" />
          </template>
        </InputGroup>
      </ControlsPopoverTrigger>
      <template #content>
        <SuggestedFonts
          v-if="mode === 'suggested'"
          :custom-fonts="customFonts"
          @go-to-custom="mode = 'custom'"
        />
        <CustomFonts v-else @go-to-suggested="mode = 'suggested'" />
      </template>
    </Popover>
  </div>
</template>
