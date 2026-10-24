<template>
  <AlertDialog class="sm:max-w-[400px]" status="danger" title="Delete this item?">
    <!-- Any focusable element can be the trigger (HeroUI's AlertDialog.Trigger) -->
    <button
      type="button"
      class="group flex cursor-(--cursor-interactive) items-center gap-3 rounded-2xl bg-surface p-4 text-start shadow-xs transition-[transform,background-color,box-shadow] select-none hover:bg-surface-secondary focus-visible:status-focused active:scale-[0.97] motion-reduce:transition-none"
    >
      <div
        class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger-soft-foreground"
      >
        <Icon class="size-6" icon="gravity-ui:trash-bin" />
      </div>
      <div class="flex flex-1 flex-col gap-0.5">
        <p class="text-sm font-semibold">Delete Item</p>
        <p class="text-xs text-muted">Permanently remove this item</p>
      </div>
    </button>
    <template #icon>
      <Icon class="size-5" icon="gravity-ui:trash-bin" />
    </template>
    <template #body>
      <p>
        Use the <code>default</code> slot to create custom trigger elements beyond standard buttons.
        This example shows a card-style trigger with icons and descriptive text.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="tertiary" @click="close"> Cancel </Button>
      <Button variant="danger" @click="close"> Delete Item </Button>
    </template>
  </AlertDialog>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
