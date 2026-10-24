<template>
  <ComboBox
    v-model:input-value="filterText"
    allows-empty-collection
    class="w-[256px]"
    label="Pick a Character"
    placeholder="Star Wars characters..."
    :filter="false"
    :items="characters.map((c) => ({ value: c.name, label: c.name }))"
    :loading="loading"
    @load-more="loadMore"
  >
    <template #empty>
      <EmptyState />
    </template>
    <template #loading>
      <div class="flex items-center justify-center gap-2 py-2">
        <Spinner size="sm" />
        <span class="muted text-sm">Loading more...</span>
      </div>
    </template>
  </ComboBox>
</template>

<script setup lang="ts">
import { ComboBox, EmptyState, Spinner } from '@hareui/vue'
import { onMounted, ref, watch } from 'vue'

type Character = {
  name: string
}

// HeroUI's `useAsyncList` equivalent: refetch on every input change, follow the `next` cursor on `load-more`
const filterText = ref('')
const characters = ref<Character[]>([])
const loading = ref(false)
let cursor: string | null = null
let controller: AbortController | undefined

const load = async (url: string, append: boolean) => {
  controller?.abort()
  controller = new AbortController()
  loading.value = true

  try {
    const json = await (
      await fetch(url.replace(/^http:\/\//i, 'https://'), { signal: controller.signal })
    ).json()

    cursor = json.next
    characters.value = append ? [...characters.value, ...json.results] : json.results
    loading.value = false
  } catch (error) {
    if ((error as Error).name !== 'AbortError') loading.value = false
  }
}

const loadMore = () => {
  if (cursor && !loading.value) load(cursor, true)
}

watch(filterText, (text) => load(`https://swapi.py4e.com/api/people/?search=${text}`, false))

// Client only: VitePress SSR-renders demos
onMounted(() => load('https://swapi.py4e.com/api/people/?search=', false))
</script>
