<template>
  <div class="flex items-center gap-4">
    <Tooltip :delay="0" text="This is a tooltip">
      <Button variant="secondary">Hover me</Button>
    </Tooltip>

    <Tooltip :delay="0" text="More information">
      <Button aria-label="More information" icon-only variant="tertiary">
        <Icon icon="gravity-ui:circle-info" />
      </Button>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { Button, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
