<script setup lang="ts">
import { AlertDialog, Button, Checkbox, Kbd, Label, Tooltip } from '@hareui/vue'
// Port of HeroUI docs `themes/components/shuffle-button.tsx`.
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'

import { useKeyPress } from '../composables/keyPress'
import { useRandomizeVariables, useVariablesState } from '../composables/variables'
import { LOCAL_STORAGE_KEYS } from '../constants'
import { compareThemeVariables } from '../utils/compare-theme-variables'

const props = withDefaults(defineProps<{ enableKeyboardShortcut?: boolean }>(), {
  enableKeyboardShortcut: true,
})

const isDontShowAgainChecked = ref(false)
const isOpen = ref(false)
const randomize = useRandomizeVariables()
const [variables] = useVariablesState()
let snapshotVariables = variables.value
let isRandomizing = false

function handleRandomize() {
  isRandomizing = true
  randomize()
  if (isDontShowAgainChecked.value) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SHUFFLE_WARNING_SHOWN, JSON.stringify(true))
  }
  isOpen.value = false
}

function handleModalTrigger() {
  const dontShowAgain = localStorage.getItem(LOCAL_STORAGE_KEYS.SHUFFLE_WARNING_SHOWN)
  const isSame = compareThemeVariables(variables.value, snapshotVariables)

  if (isSame || dontShowAgain === 'true') {
    isRandomizing = true
    return randomize()
  }

  isOpen.value = true
}

useKeyPress('r', handleModalTrigger, { enabled: () => props.enableKeyboardShortcut })

function handleOpenChange(open: boolean) {
  isDontShowAgainChecked.value = false
  isOpen.value = open
}

function handleClose() {
  isDontShowAgainChecked.value = false
  isOpen.value = false
}

// Update snapshot after randomize completes (when variables change due to randomization)
watch(variables, (current) => {
  if (isRandomizing) {
    snapshotVariables = current
    isRandomizing = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <Tooltip :delay="0">
      <!-- HeroUI `Tooltip.Trigger` renders this focusable wrapper -->
      <div class="inline-block w-min" data-slot="tooltip-trigger" role="button" tabindex="0">
        <Button icon-only size="md" variant="tertiary" @click="handleModalTrigger">
          <Icon icon="gravity-ui:shuffle" />
        </Button>
      </div>
      <template #content>
        <p>Randomize <Kbd>R</Kbd></p>
      </template>
    </Tooltip>
    <AlertDialog
      :open="isOpen"
      status="default"
      dismissible
      title="Are you sure you want to randomize?"
      :ui="{ footer: 'flex-col sm:flex-row sm:items-center' }"
      @update:open="handleOpenChange"
    >
      <template #icon>
        <Icon icon="gravity-ui:shuffle" />
      </template>
      <template #body>This will overwrite your current theme settings.</template>
      <template #footer>
        <Button
          class="order-2 w-full sm:order-2 sm:w-auto"
          size="md"
          variant="tertiary"
          @click="handleClose"
          >Cancel</Button
        >
        <Button class="order-1 w-full sm:order-3 sm:w-auto" size="md" @click="handleRandomize"
          >Confirm</Button
        >
        <div class="order-3 flex flex-1 items-center gap-2 self-start sm:order-1 sm:self-center">
          <Checkbox id="dont-show-again" v-model="isDontShowAgainChecked" variant="secondary" />
          <Label for="dont-show-again">Don't show again</Label>
        </div>
      </template>
    </AlertDialog>
  </div>
</template>
