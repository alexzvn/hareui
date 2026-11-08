<template>
  <div class="flex flex-wrap gap-4">
    <Sheet
      v-for="placement in placements"
      :key="placement"
      close-button
      :placement="placement"
      variant="blur"
      :title="`${capitalize(placement)} Sheet`"
      :class="placement === 'left' || placement === 'right' ? 'w-[400px]' : undefined"
    >
      <Button variant="secondary"> {{ capitalize(placement) }} </Button>
      <template #body>
        <p class="text-sm text-muted">
          This sheet enters from the <strong>{{ placement }}</strong> edge and leaves the same way
          when you swipe it back.
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="secondary" @click="close"> Cancel </Button>
        <Button variant="secondary" @click="close"> Done </Button>
      </template>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'

const placements = ['bottom', 'top', 'left', 'right'] as const

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
</script>
