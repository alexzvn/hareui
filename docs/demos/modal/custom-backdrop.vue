<template>
  <Modal
    variant="blur"
    class="sm:max-w-[360px]"
    :ui="{
      backdrop:
        'bg-linear-to-t from-black/80 via-black/40 to-transparent dark:from-zinc-800/80 dark:via-zinc-800/40',
      header: 'items-center text-center',
      icon: 'bg-accent-soft text-accent-soft-foreground',
      footer: 'flex-col-reverse',
    }"
  >
    <Button variant="secondary"> Custom Backdrop </Button>
    <template #icon>
      <Icon class="size-5" icon="gravity-ui:sparkles" />
    </template>
    <template #title> Premium Backdrop </template>
    <template #body>
      <p>
        This backdrop features a sophisticated gradient that transitions from a dark color at the
        bottom to complete transparency at the top, combined with a smooth blur effect. The gradient
        automatically adapts its intensity for optimal contrast in both light and dark modes.
      </p>
    </template>
    <template #footer="{ close }">
      <Button class="w-full" @click="close"> Amazing! </Button>
      <Button class="w-full" variant="secondary" @click="close"> Close </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
