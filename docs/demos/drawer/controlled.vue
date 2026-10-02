<script setup lang="ts">
import { Button, Drawer } from 'herouse'
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
        Control the drawer using Vue's <code class="text-foreground">ref</code> and
        <code class="text-foreground">v-model:open</code> for simple state management.
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
            Open Drawer
          </Button>
          <Button size="sm" variant="tertiary" @click="isOpen = !isOpen">
            Toggle
          </Button>
        </div>
      </div>
      <Drawer v-model:open="isOpen" placement="right" title="Controlled with v-model:open">
        <template #body>
          <p>
            This drawer is controlled by Vue's <code>ref</code>. Bind
            <code>v-model:open</code> to manage the drawer state externally.
          </p>
        </template>
        <template #footer="{ close }">
          <Button variant="secondary" @click="close">
            Close
          </Button>
        </template>
      </Drawer>
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
            Open Drawer
          </Button>
          <Button size="sm" variant="tertiary" @click="state.toggle">
            Toggle
          </Button>
        </div>
      </div>
      <Drawer :open="state.isOpen" @update:open="state.setOpen" placement="right" title="Controlled with useOverlayState()">
        <template #body>
          <p>
            The <code>useOverlayState</code> composable provides dedicated methods for common
            operations. No need to manually create callbacks—just use
            <code>state.open()</code>, <code>state.close()</code>, or
            <code>state.toggle()</code>.
          </p>
        </template>
        <template #footer="{ close }">
          <Button variant="secondary" @click="close">
            Close
          </Button>
        </template>
      </Drawer>
    </div>
  </div>
</template>
