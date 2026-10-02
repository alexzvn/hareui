<script setup lang="ts">
import { ListBox } from 'herouse'
import { ref } from 'vue'

const items = [
  { value: 'a', label: 'Alpha', description: 'First' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
  { value: 'd', label: 'Delete', variant: 'danger' as const },
]
const sections = [
  { type: 'section' as const, label: 'Fruits', items: [{ value: 'apple', label: 'Apple' }, { value: 'pear', label: 'Pear' }] },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'Veggies', items: [{ value: 'kale', label: 'Kale' }] },
]
const many = Array.from({ length: 1000 }, (_, i) => ({ value: i, label: `Row ${i}` }))
const single = ref<string | null>('a')
const multi = ref<string[]>(['a'])
const actions = ref<string[]>([])
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      ListBox
    </h1>
    <section class="flex flex-wrap gap-8">
      <div class="w-[220px]">
        <ListBox v-model="single" :items="items" />
        <p data-test="single">{{ single }}</p>
      </div>
      <div class="w-[220px]">
        <ListBox v-model="multi" selection-mode="multiple" :items="items" />
        <p data-test="multi">{{ multi.join(',') }}</p>
      </div>
      <div class="w-[220px]">
        <ListBox selection-mode="none" :items="sections" @action="v => actions.push(String(v))" />
        <p data-test="actions">{{ actions.join(',') }}</p>
      </div>
      <ListBox class="w-[220px]" :items="[]">
        <template #empty>
          No results
        </template>
      </ListBox>
      <ListBox class="h-[300px] w-[220px] overflow-y-auto" :items="many" virtualize />
    </section>
  </div>
</template>
