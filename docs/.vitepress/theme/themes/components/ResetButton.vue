<template>
  <Tooltip :delay="100" arrow>
    <!-- HeroUI `Tooltip.Trigger` renders this focusable wrapper -->
    <div class="inline-block" data-slot="tooltip-trigger" role="button" tabindex="0">
      <AlertDialog
        v-model:open="isOpen"
        status="default"
        dismissible
        title="Reset theme to default?"
        :ui="{ footer: 'flex-col sm:flex-row' }"
      >
        <Button icon-only :disabled="isDisabled" size="md" variant="tertiary">
          <Icon icon="gravity-ui:arrow-rotate-left" />
        </Button>
        <template #icon>
          <Icon icon="gravity-ui:arrow-rotate-left" />
        </template>
        <template #body>This will restore all theme values to their default settings.</template>
        <template #footer="{ close }">
          <Button
            class="order-2 w-full sm:order-1 sm:w-auto"
            size="md"
            variant="tertiary"
            @click="close()"
            >Cancel</Button
          >
          <Button
            class="order-1 w-full sm:order-2 sm:w-auto"
            size="md"
            @click="
              () => {
                reset()
                close()
              }
            "
          >
            Confirm
          </Button>
        </template>
      </AlertDialog>
    </div>
    <template #content>
      <p>Reset to defaults <Kbd>D</Kbd></p>
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import { AlertDialog, Button, Kbd, Tooltip } from '@hareui/vue'
// Port of HeroUI docs `themes/components/reset-button.tsx`.
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

import { useKeyPress } from '../composables/keyPress'
import { useResetVariables, useVariablesState } from '../composables/variables'
import { defaultThemeVariables } from '../constants'

const reset = useResetVariables()
const [variables] = useVariablesState()
const isOpen = ref(false)

const isDisabled = computed(() => {
  const v = variables.value
  return (
    v.chroma === defaultThemeVariables.chroma &&
    v.hue === defaultThemeVariables.hue &&
    v.lightness === defaultThemeVariables.lightness &&
    v.fontFamily === defaultThemeVariables.fontFamily &&
    v.formRadius === defaultThemeVariables.formRadius &&
    v.radius === defaultThemeVariables.radius &&
    v.base === defaultThemeVariables.base
  )
})

useKeyPress('d', () => (isOpen.value = true), { enabled: () => !isDisabled.value })
</script>
