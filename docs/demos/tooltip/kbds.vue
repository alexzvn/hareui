<template>
  <div class="flex items-center gap-4">
    <Tooltip :delay="0" text="Search" :kbds="[{ keys: 'command' }, 'K']">
      <Button aria-label="Search" icon-only variant="tertiary">
        <Icon icon="gravity-ui:magnifier" />
      </Button>
    </Tooltip>

    <Tooltip :delay="0" text="Save draft" :kbds="[{ keys: ['command', 'shift'] }, 'S']">
      <Button variant="secondary">Save</Button>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { Button, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
