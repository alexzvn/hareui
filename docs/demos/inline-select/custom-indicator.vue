<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { InlineSelect } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const visibilities: ListBoxItem[] = [
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private' },
]

const visibility = ref<SelectValue>('unlisted')
</script>

<template>
  <InlineSelect
    v-model="visibility"
    aria-label="Visibility"
    :items="visibilities"
    :ui="{ popover: 'w-36' }"
  >
    <template #indicator>
      <Icon icon="gravity-ui:chevron-down" />
    </template>
  </InlineSelect>
</template>
