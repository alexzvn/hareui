<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const sizes = ['xs', 'sm', 'md', 'lg', 'cover'] as const
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <AlertDialog
      v-for="size in sizes"
      :key="size"
      :size="size"
      :title="`Size: ${capitalize(size)}`"
      :ui="{ icon: 'bg-default text-foreground' }"
    >
      <Button variant="secondary">
        {{ capitalize(size) }}
      </Button>
      <template #icon>
        <Icon class="size-5" icon="gravity-ui:rocket" />
      </template>
      <template #body>
        <p v-if="size === 'cover'">
          This alert dialog uses the <code>cover</code> size variant. It spans the
          full screen with margins: 16px on mobile and 40px on desktop. Maintains
          rounded corners and standard padding. Perfect for critical confirmations
          that need maximum width while preserving alert dialog aesthetics.
        </p>
        <p v-else>
          This alert dialog uses the <code>{{ size }}</code> size variant. On mobile
          devices, all sizes adapt to near full-width for optimal viewing. On desktop,
          each size provides a different maximum width to suit various content needs.
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close">
          Cancel
        </Button>
        <Button @click="close">
          Confirm
        </Button>
      </template>
    </AlertDialog>
  </div>
</template>
