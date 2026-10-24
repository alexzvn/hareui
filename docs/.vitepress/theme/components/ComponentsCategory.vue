<template>
  <div v-if="components.length" class="not-prose flex flex-col gap-12">
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <ComponentItem
          v-for="component in components"
          :key="component.slug"
          :slug="component.slug"
          :title="component.title"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { COMPONENT_GROUPS } from '../../componentGroups'
import ComponentItem from './ComponentItem.vue'
import { componentPages } from './componentPages'

const props = defineProps<{ category: string }>()

const components = computed(() => componentPages(COMPONENT_GROUPS[props.category] ?? []))
</script>
