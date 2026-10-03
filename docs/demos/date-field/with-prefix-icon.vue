<script setup lang="ts">
import { DateField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <DateField class="w-[256px]" name="date" label="Date">
    <template #prefix>
      <Icon class="size-4 text-muted" icon="gravity-ui:calendar" />
    </template>
  </DateField>
</template>
