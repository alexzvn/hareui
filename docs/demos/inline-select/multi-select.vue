<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { InlineSelect } from '@hareui/vue'
import { ref } from 'vue'

const amenities: ListBoxItem[] = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'parking', label: 'Parking' },
  { value: 'pool', label: 'Pool' },
]

const selected = ref<SelectValue>(['wifi', 'breakfast'])
</script>

<template>
  <InlineSelect
    v-model="selected"
    aria-label="Amenities"
    selection-mode="multiple"
    :items="amenities"
    :ui="{ popover: 'w-44' }"
  />
</template>
