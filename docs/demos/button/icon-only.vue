<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex gap-3">
    <Button aria-label="More options" icon-only variant="tertiary">
      <Icon icon="gravity-ui:ellipsis" />
    </Button>
    <Button aria-label="Settings" icon-only variant="secondary">
      <Icon icon="gravity-ui:gear" />
    </Button>
    <Button aria-label="Delete" icon-only variant="danger">
      <Icon icon="gravity-ui:trash-bin" />
    </Button>
  </div>
</template>
