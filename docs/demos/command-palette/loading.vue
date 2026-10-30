<template>
  <CommandPalette
    v-model:search-term="searchTerm"
    :groups="groups"
    :loading="isLoading"
    :autofocus="false"
    placeholder="Search cities..."
    class="h-72 w-full max-w-md rounded-2xl bg-surface shadow-surface"
  />
</template>

<script setup lang="ts">
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const cities = [
  'Lisbon',
  'Hanoi',
  'Montreal',
  'Nairobi',
  'Oslo',
  'Lima',
  'Osaka',
  'Tbilisi',
  'Perth',
]

const searchTerm = ref('')
const isLoading = ref(false)
const results = ref<string[]>(cities)

let timer: ReturnType<typeof setTimeout> | undefined

// Stands in for a server request: the results arrive 600 ms after typing.
watch(searchTerm, (term) => {
  clearTimeout(timer)
  isLoading.value = true

  timer = setTimeout(() => {
    results.value = cities.filter((city) => city.toLowerCase().includes(term.toLowerCase()))
    isLoading.value = false
  }, 600)
})

onBeforeUnmount(() => clearTimeout(timer))

// The server already filtered the list, so the palette shows it as is.
const groups = computed<CommandPaletteGroup[]>(() => [
  {
    id: 'cities',
    label: 'Cities',
    ignoreFilter: true,
    items: results.value.map((city) => ({ label: city })),
  },
])
</script>
