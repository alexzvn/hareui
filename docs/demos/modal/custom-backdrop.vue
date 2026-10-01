<script setup lang="ts">
import { Button, Modal } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Modal
    variant="blur"
    :ui="{ backdrop: 'bg-linear-to-t from-black/80 via-black/40 to-transparent dark:from-zinc-800/80 dark:via-zinc-800/40' }"
  >
    <Button variant="secondary">
      Custom Backdrop
    </Button>
    <template #header>
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-3xl bg-accent-soft text-accent-soft-foreground">
          <Icon icon="gravity-ui:sparkles" />
        </div>
        <p class="text-base font-medium text-foreground">
          Premium Backdrop
        </p>
      </div>
    </template>
    <template #body>
      <p>
        This backdrop features a sophisticated gradient that transitions from a dark color
        at the bottom to complete transparency at the top, combined with a smooth blur
        effect. The gradient automatically adapts its intensity for optimal contrast in both
        light and dark modes.
      </p>
    </template>
    <template #footer="{ close }">
      <div class="flex w-full flex-col-reverse gap-2">
        <Button class="w-full" variant="secondary" @click="close">
          Close
        </Button>
        <Button class="w-full" @click="close">
          Amazing!
        </Button>
      </div>
    </template>
  </Modal>
</template>
