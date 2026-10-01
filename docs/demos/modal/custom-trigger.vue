<script setup lang="ts">
import { Button, Modal } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Modal class="sm:max-w-[360px]" :ui="{ icon: 'bg-accent-soft text-accent-soft-foreground' }">
    <button
      type="button"
      class="group flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-xs select-none hover:bg-surface-secondary"
    >
      <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
        <Icon class="size-6" icon="gravity-ui:gear" />
      </div>
      <div class="flex flex-1 flex-col gap-0.5 text-start">
        <p class="text-sm font-semibold">
          Settings
        </p>
        <p class="text-xs text-muted">
          Manage your preferences
        </p>
      </div>
    </button>
    <template #icon>
      <Icon class="size-5" icon="gravity-ui:gear" />
    </template>
    <template #title>
      Settings
    </template>
    <template #body>
      <p>
        Use the <code>default</code> slot to create custom trigger elements beyond standard
        buttons. This example shows a card-style trigger with icons and descriptive text.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close">
        Cancel
      </Button>
      <Button @click="close">
        Save
      </Button>
    </template>
  </Modal>
</template>
