<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ComboBox } from '@hareui/vue'

const animals: ListBoxItem[] = [
  { value: 'aardvark', label: 'Aardvark' },
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'kangaroo', label: 'Kangaroo' },
  { value: 'panda', label: 'Panda' },
  { value: 'snake', label: 'Snake' },
]
</script>

<template>
  <ComboBox allows-custom-value class="w-[256px]" label="Favorite Animal" placeholder="Search or type an animal..." description="You can type any animal name, even if it's not in the list" :items="animals" />
</template>
