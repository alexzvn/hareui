<script setup lang="ts">
import { Button, Modal } from 'herouse'
import { Icon } from '@iconify/vue'

const animations = [
  {
    name: 'Kinematic Scale',
    icon: 'gravity-ui:sparkles',
    description:
      'Physics-based elastic scaling. Simulates a high-damping spring system with fast transient response and prolonged settling time. Ideal for Modals and Popovers.',
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
  },
  {
    name: 'Fluid Slide',
    icon: 'gravity-ui:arrow-up-from-line',
    description:
      'Simulates movement through a medium with fluid resistance. Eliminates mechanical linearity for a natural, grounded feel. Perfect for Bottom Sheets or Toasts.',
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
  },
]
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Modal
      v-for="animation in animations"
      :key="animation.name"
      :ui="{ backdrop: animation.classNames.backdrop, container: animation.classNames.container }"
    >
      <Button variant="secondary">
        {{ animation.name }}
      </Button>
      <template #icon>
        <Icon class="text-foreground" :icon="animation.icon" />
      </template>
      <template #title>
        {{ animation.name }} Animation
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
    </Modal>
  </div>
</template>
