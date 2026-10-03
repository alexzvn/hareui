<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ComboBox } from 'herouse'

const animals = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]
</script>

<template>
  <ComboBox class="w-[256px]" label="Favorite Animal" placeholder="Search animals..." :items="animals">
    <template #indicator>
      <Icon class="size-3" icon="gravity-ui:chevrons-expand-vertical" />
    </template>
  </ComboBox>
</template>
