<template>
  <div class="flex flex-wrap gap-4">
    <Sheet
      v-for="variant in variants"
      :key="variant"
      close-button
      :variant="variant"
      :title="`Backdrop: ${capitalize(variant)}`"
      class="mx-auto max-h-[95vh] max-w-[420px]"
    >
      <Button variant="secondary"> {{ capitalize(variant) }} </Button>
      <template #body>
        <p class="text-sm text-muted">
          The page behind this sheet uses the
          <code class="text-foreground">{{ variant }}</code> backdrop.
        </p>
      </template>
      <template #footer="{ close }">
        <Button class="w-full" @click="close"> Close </Button>
      </template>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'

const variants = ['opaque', 'blur', 'transparent'] as const

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
</script>
