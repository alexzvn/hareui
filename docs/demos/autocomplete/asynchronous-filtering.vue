<template>
  <Autocomplete
    v-model:input-value="filterText"
    allows-empty-collection
    clearable
    class="w-[256px]"
    label="Search a Star Wars characters"
    placeholder="Search..."
    search-label="Search characters"
    search-placeholder="Search characters..."
    :filter="false"
    :items="characters.map((c) => ({ value: c.name, label: c.name }))"
    :ui="{
      searchField: 'sticky top-0 z-10',
      listBox: 'max-h-[420px] overflow-y-auto',
      searchClearButton: isLoading ? 'pointer-events-none opacity-0' : undefined,
    }"
  >
    <template #search-trailing>
      <Spinner
        size="sm"
        class="absolute end-2 top-1/2 -translate-y-1/2"
        :class="{ 'pointer-events-none opacity-0': !isLoading }"
      />
    </template>
    <template #empty> No results found </template>
  </Autocomplete>
</template>

<script setup lang="ts">
import { Autocomplete, Spinner } from '@hareui/vue'
import { onMounted, ref, watch } from 'vue'

type Character = {
  name: string
}

// HeroUI's `useAsyncList`: refetch whenever the search text changes, abort the previous request
const filterText = ref('')
const characters = ref<Character[]>([])
const isLoading = ref(false)
let controller: AbortController | undefined

const load = async (text: string) => {
  controller?.abort()
  controller = new AbortController()
  isLoading.value = true

  try {
    const res = await fetch(`https://swapi.py4e.com/api/people/?search=${text}`, {
      signal: controller.signal,
    })

    characters.value = (await res.json()).results
    isLoading.value = false
  } catch (error) {
    if ((error as Error).name !== 'AbortError') isLoading.value = false
  }
}

watch(filterText, load)

// Client only: VitePress SSR-renders demos
onMounted(() => load(''))
</script>
