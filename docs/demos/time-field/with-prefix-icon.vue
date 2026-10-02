<script setup lang="ts">
import { TimeField } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <TimeField class="w-[256px]" name="time" label="Time">
    <template #prefix>
      <Icon class="size-4 text-muted" icon="gravity-ui:clock" />
    </template>
  </TimeField>
</template>
