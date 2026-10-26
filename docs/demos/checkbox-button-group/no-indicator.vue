<template>
  <CheckboxButtonGroup
    class="w-[360px]"
    name="topics"
    label="Podcast topics"
    :default-value="['history']"
  >
    <CheckboxButtonGroupItem
      v-for="topic in topics"
      :key="topic.value"
      :indicator="false"
      :value="topic.value"
      :label="topic.label"
      :description="topic.description"
    />
  </CheckboxButtonGroup>
</template>

<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'

const topics = [
  { value: 'science', label: 'Science', description: 'Space, biology and everyday physics' },
  { value: 'history', label: 'History', description: 'Untold stories from the past' },
  { value: 'comedy', label: 'Comedy', description: 'Panel shows and improv nights' },
]
</script>
