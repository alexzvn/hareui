<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, Popover } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-4">
    <Popover title="Popover with Arrow" arrow class="max-w-64">
      <Button variant="secondary">With Arrow</Button>
      <template #content>
        <p class="mt-2 text-sm text-muted">
          The arrow shows which element triggered the popover.
        </p>
      </template>
    </Popover>

    <Popover title="Popover with Arrow" arrow class="max-w-64" :side-offset="10">
      <Button icon-only aria-label="More options" variant="tertiary">
        <Icon icon="gravity-ui:ellipsis" />
      </Button>
      <template #content>
        <p class="mt-2 text-sm text-muted">
          The arrow shows which element triggered the popover.
        </p>
      </template>
    </Popover>
  </div>
</template>
