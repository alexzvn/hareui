<template>
  <div class="w-[400px] space-y-4">
    <TimeField full-width name="time" label="Time" />
    <TimeField full-width name="time-icons" label="Time">
      <template #prefix>
        <Icon class="size-4 text-muted" icon="gravity-ui:clock" />
      </template>
      <template #suffix>
        <Icon class="size-4 text-muted" icon="gravity-ui:chevron-down" />
      </template>
    </TimeField>
  </div>
</template>

<script setup lang="ts">
import { TimeField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
