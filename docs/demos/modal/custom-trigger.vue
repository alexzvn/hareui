<script setup lang="ts">
import { Button, Modal } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Modal>
    <button
      type="button"
      class="group flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-xs select-none hover:bg-surface-secondary"
    >
      <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
        <Icon icon="gravity-ui:gear" width="24" />
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
      <Icon icon="gravity-ui:gear" />
    </template>
    <template #title>
      Settings
    </template>
    <template #body>
      <p>
        Use any element as the default slot to create custom trigger elements beyond
        standard buttons. This example shows a card-style trigger with icons and
        descriptive text.
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
