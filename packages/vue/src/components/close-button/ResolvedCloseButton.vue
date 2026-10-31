<template>
  <CloseButton :aria-label="options.label ?? t(labelKey)">
    <IconRenderer v-if="options.icon" :icon="options.icon" data-slot="close-button-icon" />
  </CloseButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '@/composables/useLocale'
import type { MessageKey } from '@/locale/defineLocale'
import type { CloseButtonProp } from '@/types/closeButton'
import { resolveCloseButton } from '@/utils/closeButton'
import { IconRenderer } from '@/utils/icon'

import CloseButton from './CloseButton.vue'

// The built-in close button of a component with a `closeButton` prop. `data-slot`, `class` and listeners fall through
// to `CloseButton`, so the host styles it as its own slot.
const props = defineProps<{
  /** The host's `closeButton` prop. */
  closeButton?: CloseButtonProp
  /** The locale message naming the button when `closeButton.label` is unset. */
  labelKey: MessageKey
}>()

const { t } = useLocale()

const options = computed(() => resolveCloseButton(props.closeButton))
</script>
