<script setup lang="ts">
import { computed } from 'vue'

import ComponentItem from './ComponentItem.vue'
import { componentPages } from './componentPages'

// Port of HeroUI docs' related-components.tsx. HeroUI looks the list up in its registry and keeps
// the first 3; HareUI pages pass their own list (slugs under /docs/components).
const props = defineProps<{ components: string[] }>()

const items = computed(() => componentPages(props.components))
</script>

<template>
  <div
    v-if="items.length"
    class="not-prose grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
  >
    <ComponentItem v-for="item in items" :key="item.slug" :slug="item.slug" :title="item.title" />
  </div>
</template>
