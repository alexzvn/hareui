<script setup lang="ts">
import { TagGroup } from 'herouse'
import { computed, ref } from 'vue'

const items = [
  { id: 'laundry', label: 'Laundry' },
  { id: 'fitness', label: 'Fitness center' },
  { id: 'parking', label: 'Parking' },
  { id: 'pool', label: 'Swimming pool' },
  { id: 'breakfast', label: 'Breakfast' },
]
const selected = ref<string[]>([])
const isInvalid = computed(() => selected.value.length === 0)
const description = computed(() => isInvalid.value ? 'Select at least one category' : `Selected: ${selected.value.join(', ')}`)
const errorMessage = computed(() => isInvalid.value ? 'Please select at least one category' : '')
</script>

<template>
  <TagGroup v-model:selected="selected" selection-mode="multiple" label="Amenities" :description="description" :error-message="errorMessage" :items="items" />
</template>
