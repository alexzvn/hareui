<script setup lang="ts">
import { Button, Popover } from 'herouse'
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div />
    <Popover side="top" arrow>
      <Button class="w-full" variant="tertiary">
        Top
      </Button>
      <template #content>
        <p class="text-sm">Top placement</p>
      </template>
    </Popover>
    <div />

    <Popover side="left" arrow>
      <Button class="w-full" variant="tertiary">
        Left
      </Button>
      <template #content>
        <p class="text-sm">Left placement</p>
      </template>
    </Popover>

    <div class="flex items-center justify-center">
      <span class="text-sm text-muted">Click buttons</span>
    </div>

    <Popover side="right" arrow>
      <Button class="w-full" variant="tertiary">
        Right
      </Button>
      <template #content>
        <p class="text-sm">Right placement</p>
      </template>
    </Popover>

    <div />
    <Popover side="bottom" arrow>
      <Button class="w-full" variant="tertiary">
        Bottom
      </Button>
      <template #content>
        <p class="text-sm">Bottom placement</p>
      </template>
    </Popover>
    <div />
  </div>
</template>
