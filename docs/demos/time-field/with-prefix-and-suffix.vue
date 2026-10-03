<script setup lang="ts">
import { TimeField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <TimeField class="w-[256px]" name="time" label="Time" description="Enter a time">
    <template #prefix>
      <Icon class="size-4 text-muted" icon="gravity-ui:clock" />
    </template>
    <template #suffix>
      <Icon class="size-4 text-muted" icon="gravity-ui:chevron-down" />
    </template>
  </TimeField>
</template>
