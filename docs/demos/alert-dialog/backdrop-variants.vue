<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'

const variants = ['opaque', 'blur', 'transparent'] as const
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const descriptions = {
  opaque: 'An opaque dark backdrop that completely obscures the background, providing maximum focus on the dialog.',
  blur: 'A blurred backdrop that softly obscures the background while maintaining visual context.',
  transparent: 'A transparent backdrop that keeps the background fully visible, useful for less critical confirmations.',
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <AlertDialog
      v-for="variant in variants"
      :key="variant"
      class="sm:max-w-[400px]"
      status="accent"
      :title="`Backdrop: ${capitalize(variant)}`"
      :variant="variant"
    >
      <Button variant="secondary">
        {{ capitalize(variant) }}
      </Button>
      <template #body>
        <p>{{ descriptions[variant] }}</p>
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
