<template>
  <div class="flex min-h-screen items-center justify-center p-6">
    <p class="text-sm text-muted">The bar below has no surface background.</p>
    <ActionBar default-open :attached="false" aria-label="Playback">
      <Button icon-only size="sm" variant="tertiary" aria-label="Previous">
        <Icon icon="gravity-ui:backward-step" />
      </Button>
      <Button icon-only size="sm" aria-label="Play">
        <Icon icon="gravity-ui:play" />
      </Button>
      <Button icon-only size="sm" variant="tertiary" aria-label="Next">
        <Icon icon="gravity-ui:forward-step" />
      </Button>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { ActionBar, Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
