<template>
  <div class="flex w-full flex-wrap justify-center gap-4">
    <div v-for="mode in modes" :key="mode.id" class="flex w-[260px] flex-col gap-2">
      <h3 class="px-1 text-sm font-semibold text-muted">
        {{ mode.label }}
      </h3>
      <Surface class="overflow-hidden rounded-3xl shadow-surface" :data-scrollbar="mode.scrollbar">
        <div class="h-52 scrollbar overflow-y-auto p-1">
          <ListBox :aria-label="`${mode.label} animals`" :items="itemsFor(mode.id)">
            <template #item="{ item }">
              {{ item.label }}
            </template>
          </ListBox>
        </div>
      </Surface>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ListBox, Surface } from '@hareui/vue'

const modes = [
  { id: 'heroui', label: 'HeroUI thin', scrollbar: 'thin' },
  { id: 'browser', label: 'Browser default', scrollbar: 'default' },
  { id: 'hidden', label: 'Hidden', scrollbar: 'none' },
]

const animals = [
  'Aardvark',
  'Alpaca',
  'Antelope',
  'Bear',
  'Cat',
  'Dog',
  'Fox',
  'Giraffe',
  'Kangaroo',
  'Koala',
  'Lemur',
  'Otter',
  'Panda',
  'Penguin',
  'Rabbit',
  'Snake',
  'Turtle',
  'Wombat',
  'Zebra',
]

const itemsFor = (mode: string): ListBoxItem[] =>
  animals.map((name) => ({
    value: `${mode}-${name.toLowerCase()}`,
    label: name,
    class: 'text-sm leading-5 font-medium',
  }))
</script>
