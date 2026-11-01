<template>
  <div class="flex min-h-screen items-start justify-center p-6">
    <p class="text-sm text-muted">Use ArrowUp and ArrowDown to move between the buttons.</p>
    <ActionBar default-open orientation="vertical" aria-label="Text alignment">
      <Button icon-only size="sm" variant="ghost" aria-label="Align left">
        <Icon icon="gravity-ui:text-align-left" />
      </Button>
      <Button icon-only size="sm" variant="ghost" aria-label="Align center">
        <Icon icon="gravity-ui:text-align-center" />
      </Button>
      <Button icon-only size="sm" variant="ghost" aria-label="Align right">
        <Icon icon="gravity-ui:text-align-right" />
      </Button>
      <template #suffix="{ close }">
        <Button icon-only size="sm" variant="ghost" aria-label="Close" @click="close">
          <Icon icon="gravity-ui:xmark" />
        </Button>
      </template>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { ActionBar, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
