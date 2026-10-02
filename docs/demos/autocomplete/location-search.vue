<script setup lang="ts">
import { Autocomplete } from 'herouse'
import { ref, watch } from 'vue'

const allCities = [
  { country: 'USA', name: 'New York' },
  { country: 'USA', name: 'Los Angeles' },
  { country: 'USA', name: 'Chicago' },
  { country: 'UK', name: 'London' },
  { country: 'France', name: 'Paris' },
  { country: 'Japan', name: 'Tokyo' },
  { country: 'Australia', name: 'Sydney' },
  { country: 'Canada', name: 'Toronto' },
  { country: 'Germany', name: 'Berlin' },
  { country: 'Spain', name: 'Madrid' },
]
const items = allCities.map(city => ({ value: city.name, label: city.name, description: city.country }))

const selectedKey = ref<string | null>(null)
const searchText = ref('')
const isLoading = ref(false)
// Simulate async filtering
let timer: ReturnType<typeof setTimeout> | undefined
watch(searchText, (text) => {
  if (!text)
    return
  isLoading.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <Autocomplete
    v-model="selectedKey"
    v-model:input-value="searchText"
    clearable
    class="w-[256px]"
    label="City"
    placeholder="Search for a city"
    search-label="Search cities"
    search-placeholder="Search cities..."
    :items="items"
  >
    <template #empty>
      {{ isLoading ? 'Searching...' : 'No cities found' }}
    </template>
  </Autocomplete>
</template>
