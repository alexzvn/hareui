<script setup lang="ts">
import { AlertDialog, Button } from 'herouse'
import { Icon } from '@iconify/vue'

// HeroUI's `data-[entering]` / `data-[exiting]` map to Reka's `data-[state=open]` / `data-[state=closed]`.
const animations = [
  {
    classNames: {
      backdrop: [
        'data-[state=open]:duration-400',
        'data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]',
        'data-[state=closed]:duration-200',
        'data-[state=closed]:ease-[cubic-bezier(0.7,0,0.84,0)]',
      ].join(' '),
      container: [
        'data-[state=open]:animate-in',
        'data-[state=open]:fade-in-0',
        'data-[state=open]:zoom-in-95',
        'data-[state=open]:duration-400',
        'data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=closed]:zoom-out-95',
        'data-[state=closed]:duration-200',
        'data-[state=closed]:ease-[cubic-bezier(0.7,0,0.84,0)]',
      ].join(' '),
    },
    description:
      'Physics-based elastic scaling. Simulates a high-damping spring system with fast transient response and prolonged settling time. Ideal for Alert Dialogs and Modals.',
    icon: 'gravity-ui:sparkles',
    name: 'Kinematic Scale',
  },
  {
    classNames: {
      backdrop: [
        'data-[state=open]:duration-500',
        'data-[state=open]:ease-[cubic-bezier(0.25,1,0.5,1)]',
        'data-[state=closed]:duration-200',
        'data-[state=closed]:ease-[cubic-bezier(0.5,0,0.75,0)]',
      ].join(' '),
      container: [
        'data-[state=open]:animate-in',
        'data-[state=open]:fade-in-0',
        'data-[state=open]:slide-in-from-bottom-4',
        'data-[state=open]:duration-500',
        'data-[state=open]:ease-[cubic-bezier(0.25,1,0.5,1)]',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=closed]:slide-out-to-bottom-2',
        'data-[state=closed]:duration-200',
        'data-[state=closed]:ease-[cubic-bezier(0.5,0,0.75,0)]',
      ].join(' '),
    },
    description:
      'Simulates movement through a medium with fluid resistance. Eliminates mechanical linearity for a natural, grounded feel. Perfect for Bottom Sheets or Toasts.',
    icon: 'gravity-ui:arrow-up-from-line',
    name: 'Fluid Slide',
  },
]
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <AlertDialog
      v-for="animation in animations"
      :key="animation.name"
      class="sm:max-w-[400px]"
      status="accent"
      :title="`${animation.name} Animation`"
      :ui="{ backdrop: animation.classNames.backdrop, container: animation.classNames.container }"
    >
      <Button variant="secondary">
        {{ animation.name }}
      </Button>
      <template #icon>
        <Icon class="size-5" :icon="animation.icon" />
      </template>
      <template #body>
        <p class="mt-1">
          {{ animation.description }}
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close">
          Close
        </Button>
        <Button @click="close">
          Try Again
        </Button>
      </template>
    </AlertDialog>
  </div>
</template>
