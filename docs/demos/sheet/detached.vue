<template>
  <div class="flex flex-wrap gap-4">
    <Sheet
      v-for="placement in placements"
      :key="placement"
      detached
      :placement="placement"
      :title="`Detached ${placement}`"
      :class="isSide(placement) ? 'w-[310px]' : 'mx-auto max-w-[420px]'"
      :ui="{ dialog: isSide(placement) ? 'h-full' : undefined, header: 'pt-5', body: 'pb-5' }"
    >
      <Button variant="secondary"> {{ capitalize(placement) }} </Button>
      <template #body>
        <p class="text-sm text-muted">
          A margin keeps this sheet off the edge of the screen, and every corner is rounded.
        </p>
      </template>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'

const placements = ['bottom', 'top', 'left', 'right'] as const

const isSide = (placement: string) => placement === 'left' || placement === 'right'

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
</script>
