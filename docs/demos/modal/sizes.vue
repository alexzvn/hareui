<template>
  <div class="flex flex-wrap gap-4">
    <Modal v-for="size in sizes" :key="size" :size="size">
      <Button variant="secondary">
        {{ size.charAt(0).toUpperCase() + size.slice(1) }}
      </Button>
      <template #icon>
        <Icon class="text-foreground" icon="gravity-ui:rocket" />
      </template>
      <template #title> Size: {{ size.charAt(0).toUpperCase() + size.slice(1) }} </template>
      <template #body>
        <p v-if="size === 'cover'">
          This modal uses the <code>cover</code> size variant. It spans the full screen with
          margins: 16px on mobile and 40px on desktop. Maintains rounded corners and standard
          padding. Perfect for cover-style content that needs maximum width while preserving modal
          aesthetics.
        </p>
        <p v-else-if="size === 'full'">
          This modal uses the <code>full</code> size variant. It occupies the entire viewport
          without any margins, rounded corners, or shadows, creating a true fullscreen experience.
          Ideal for immersive content or full-page interactions.
        </p>
        <p v-else>
          This modal uses the <code>{{ size }}</code> size variant. On mobile devices, all sizes
          adapt to near full-width for optimal viewing. On desktop, each size provides a different
          maximum width to suit various content needs.
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="secondary" @click="close"> Cancel </Button>
        <Button @click="close"> Confirm </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const sizes = ['xs', 'sm', 'md', 'lg', 'cover', 'full'] as const
</script>
