<script setup lang="ts">
import { Select, Spinner } from 'herouse'
import { onMounted, ref } from 'vue'

interface Pokemon {
  name: string
}

// HeroUI's `useAsyncList` equivalent: fetch the first page, then the next cursor on `load-more`
const pokemon = ref<Pokemon[]>([])
const loading = ref(false)
let cursor: string | null = 'https://pokeapi.co/api/v2/pokemon'

async function loadMore() {
  if (!cursor || loading.value)
    return
  loading.value = true
  try {
    const json = await (await fetch(cursor)).json()
    cursor = json.next
    pokemon.value = [...pokemon.value, ...json.results]
  }
  finally {
    loading.value = false
  }
}
// Client only: VitePress SSR-renders demos
onMounted(loadMore)
</script>

<template>
  <Select
    class="w-[256px]"
    label="Pick a Pokemon"
    placeholder="Select a Pokemon"
    :items="pokemon.map(p => ({ value: p.name, label: p.name }))"
    :loading="loading"
    @load-more="loadMore"
  >
    <template #loading>
      <div class="flex items-center justify-center gap-2 py-2">
        <Spinner size="sm" />
        <span class="text-sm text-muted">Loading more...</span>
      </div>
    </template>
  </Select>
</template>
