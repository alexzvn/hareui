<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { reactive, ref } from 'vue'

const isOpen = ref(false)

// Vue counterpart of HeroUI's `useOverlayState` hook: a ref plus named open/close/toggle helpers.
function useOverlayState(defaultOpen = false) {
  const isOpen = ref(defaultOpen)
  return reactive({
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
    toggle: () => { isOpen.value = !isOpen.value },
    setOpen: (value: boolean) => { isOpen.value = value },
  })
}

const state = useOverlayState()
</script>

<template>
  <div class="flex max-w-md flex-col gap-8">
    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold text-foreground">
        With v-model:open
      </h3>
      <p class="text-sm leading-relaxed text-pretty text-muted">
        Control the alert dialog using Vue's <code class="text-foreground">ref</code>
        and <code class="text-foreground">v-model:open</code> for simple state management.
        Perfect for basic use cases.
      </p>
      <div class="flex flex-col items-start gap-3 rounded-2xl bg-surface p-4 shadow-sm">
        <div class="flex w-full items-center justify-between">
          <p class="text-xs text-muted">
            Status:
            <span class="font-mono font-medium text-foreground">{{ isOpen ? 'open' : 'closed' }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <Button size="sm" variant="secondary" @click="isOpen = true">
            Open Dialog
          </Button>
          <Button size="sm" variant="tertiary" @click="isOpen = !isOpen">
            Toggle
          </Button>
        </div>
      </div>
      <AlertDialog v-model:open="isOpen" class="sm:max-w-[400px]" status="accent" title="Controlled with v-model:open">
        <template #body>
          <p>
            This alert dialog is controlled by Vue's <code>ref</code>. Bind
            <code>v-model:open</code> to manage the dialog state externally.
          </p>
        </template>
        <template #footer="{ close }">
          <Button variant="tertiary" @click="close">
            Cancel
          </Button>
          <Button @click="close">
            Confirm
          </Button>
        </template>
      </AlertDialog>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-lg font-semibold text-foreground">
        With useOverlayState()
      </h3>
      <p class="text-sm leading-relaxed text-pretty text-muted">
        Use the <code class="text-foreground">useOverlayState</code> composable for a cleaner API
        with methods like <code>open()</code>, <code>close()</code>, and <code>toggle()</code>.
      </p>
      <div class="flex flex-col items-start gap-3 rounded-2xl bg-surface p-4 shadow-sm">
        <div class="flex w-full items-center justify-between">
          <p class="text-xs text-muted">
            Status:
            <span class="font-mono font-medium text-foreground">{{ state.isOpen ? 'open' : 'closed' }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <Button size="sm" variant="secondary" @click="state.open">
            Open Dialog
          </Button>
          <Button size="sm" variant="tertiary" @click="state.toggle">
            Toggle
          </Button>
        </div>
      </div>
      <AlertDialog :open="state.isOpen" class="sm:max-w-[400px]" status="success" title="Controlled with useOverlayState()" @update:open="state.setOpen">
        <template #body>
          <p>
            The <code>useOverlayState</code> composable provides dedicated methods for common
            operations. No need to manually create callbacks—just use
            <code>state.open()</code>, <code>state.close()</code>, or
            <code>state.toggle()</code>.
          </p>
        </template>
        <template #footer>
          <Button variant="tertiary" @click="state.close">
            Cancel
          </Button>
          <Button @click="state.close">
            Confirm
          </Button>
        </template>
      </AlertDialog>
    </div>
  </div>
</template>
