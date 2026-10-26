<template>
  <div class="flex min-w-[320px] flex-col gap-3">
    <CheckboxGroup v-model="selected" name="skills" label="Your skills" :items="items" />
    <p class="my-4 text-sm text-muted">Selected: {{ selected.join(', ') || 'None' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { CheckboxGroup } from '@hareui/vue'
import { ref } from 'vue'

const selected = ref<string[]>(['coding', 'design'])

const items: CheckboxGroupItem[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
]
</script>
