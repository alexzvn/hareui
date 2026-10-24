<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { InlineSelect } from '@hareui/vue'
import { computed, ref } from 'vue'

interface Environment extends ListBoxItem {
  dot: string
}

const environments: Environment[] = [
  { value: 'production', label: 'Production', description: 'app.example.com', dot: 'bg-success' },
  { value: 'staging', label: 'Staging', description: 'staging.example.com', dot: 'bg-warning' },
  { value: 'preview', label: 'Preview', description: 'pr-482.example.com', dot: 'bg-accent' },
]

const environment = ref<SelectValue>('staging')
const current = computed(
  () => environments.find((e) => e.value === environment.value) ?? environments[0]!,
)
</script>

<template>
  <InlineSelect
    v-model="environment"
    aria-label="Environment"
    :items="environments"
    :ui="{ popover: 'w-56' }"
  >
    <template #leading>
      <span aria-hidden="true" class="size-2 shrink-0 rounded-full" :class="current.dot" />
    </template>
    <template #item-leading="{ item }">
      <span aria-hidden="true" class="size-2 shrink-0 rounded-full" :class="item.dot" />
    </template>
  </InlineSelect>
</template>
