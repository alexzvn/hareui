<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'

const variants = ['opaque', 'blur', 'transparent'] as const
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Drawer
      v-for="variant in variants"
      :key="variant"
      handle
      :title="`Backdrop: ${capitalize(variant)}`"
      :variant="variant"
    >
      <Button variant="secondary">
        {{ capitalize(variant) }}
      </Button>
      <template #body>
        <p>
          This drawer uses the <code>{{ variant }}</code> backdrop variant.
        </p>
      </template>
      <template #footer="{ close }">
        <Button class="w-full" @click="close">
          Close
        </Button>
      </template>
    </Drawer>
  </div>
</template>
