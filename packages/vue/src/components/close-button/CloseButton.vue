<template>
  <button
    type="button"
    data-slot="close-button"
    :aria-label="ariaLabel"
    :disabled="disabled || undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot>
      <svg
        aria-hidden="true"
        data-slot="close-button-icon"
        fill="none"
        height="16"
        role="presentation"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        :class="ui.icon({ class: props.ui?.icon })"
      >
        <path
          clip-rule="evenodd"
          d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </slot>
  </button>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { CloseButtonProps, CloseButtonSlots } from './CloseButton.types'
import theme from './theme'

const props = withDefaults(defineProps<CloseButtonProps>(), { ariaLabel: 'Close' })
defineSlots<CloseButtonSlots>()

const ui = useComponentUI('closeButton', {
  theme,
  variantProps: () => ({ variant: props.variant }),
})
</script>
