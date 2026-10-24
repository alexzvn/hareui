<script setup lang="ts">
import { Checkbox, Label } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-3">
      <Label class="text-muted">Rounded checkboxes</Label>
      <Checkbox
        name="small-rounded"
        label="Small size"
        class="[&_[data-slot='checkbox-default-indicator--checkmark']]:size-2"
        :ui="{ control: 'size-3 rounded-full before:rounded-full' }"
      />
    </div>
    <div class="flex flex-col gap-3">
      <Checkbox
        name="default-rounded"
        label="Default size"
        :ui="{ control: 'size-4 rounded-full before:rounded-full' }"
      />
    </div>
    <div class="flex flex-col gap-3">
      <Checkbox
        name="large-rounded"
        label="Large size"
        :ui="{ control: 'size-5 rounded-full before:rounded-full' }"
      />
    </div>
    <div class="flex flex-col gap-3">
      <Checkbox
        name="xl-rounded"
        label="Extra large size"
        class="[&_[data-slot='checkbox-default-indicator--checkmark']]:size-4"
        :ui="{ control: 'size-6 rounded-full before:rounded-full' }"
      />
    </div>
  </div>
</template>
