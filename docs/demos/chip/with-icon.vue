<script setup lang="ts">
import { Chip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Chip label="Information">
      <template #leading><Icon height="16" icon="gravity-ui:circle-fill" width="6" /></template>
    </Chip>
    <Chip color="success" label="Completed">
      <template #leading
        ><Icon height="16" icon="gravity-ui:circle-check-fill" width="12"
      /></template>
    </Chip>
    <Chip color="warning" label="Pending">
      <template #leading><Icon height="16" icon="gravity-ui:clock" width="12" /></template>
    </Chip>
    <Chip color="danger" label="Failed">
      <template #leading><Icon height="16" icon="gravity-ui:xmark" width="12" /></template>
    </Chip>
    <Chip color="accent" label="Label">
      <template #trailing><Icon height="16" icon="gravity-ui:chevron-down" width="12" /></template>
    </Chip>
  </div>
</template>
