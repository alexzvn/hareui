<script setup lang="ts">
import { Chip } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <Chip label="Default" variant="primary">
        <template #leading><Icon icon="gravity-ui:circle-fill" width="6" /></template>
      </Chip>
      <Chip color="success" label="Active" variant="primary">
        <template #leading><Icon icon="gravity-ui:circle-fill" width="6" /></template>
      </Chip>
      <Chip color="warning" label="Pending" variant="primary">
        <template #leading><Icon icon="gravity-ui:circle-fill" width="6" /></template>
      </Chip>
      <Chip color="danger" label="Inactive" variant="primary">
        <template #leading><Icon icon="gravity-ui:circle-fill" width="6" /></template>
      </Chip>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <Chip label="New Feature">
        <template #leading><Icon icon="gravity-ui:circle-info" width="12" /></template>
      </Chip>
      <Chip color="success" label="Available">
        <template #leading><Icon icon="gravity-ui:check" width="12" /></template>
      </Chip>
      <Chip color="warning" label="Beta">
        <template #leading><Icon icon="gravity-ui:triangle-exclamation" width="12" /></template>
      </Chip>
      <Chip color="danger" label="Deprecated">
        <template #leading><Icon icon="gravity-ui:ban" width="12" /></template>
      </Chip>
    </div>
  </div>
</template>
