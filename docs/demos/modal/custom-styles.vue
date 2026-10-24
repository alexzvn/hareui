<template>
  <Modal
    variant="blur"
    :ui="{
      backdrop: 'bg-overlay/50 dark:bg-overlay/65',
      dialog:
        'relative overflow-hidden border border-border/80 bg-surface/90 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:max-w-[340px] dark:border-border/90 dark:bg-surface/85 dark:ring-white/10',
    }"
  >
    <Button variant="secondary"> Open </Button>
    <template #icon>
      <Icon class="text-neutral-700 dark:text-neutral-200" icon="gravity-ui:circle-check" />
    </template>
    <template #title> Changes saved </template>
    <template #body>
      <p class="text-sm text-muted">Your draft is synced across devices.</p>
    </template>
    <template #footer="{ close }">
      <Button class="w-full" @click="close"> Done </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
