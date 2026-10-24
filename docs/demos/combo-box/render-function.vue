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
  <!-- HeroUI's `render` prop has no Vue equivalent (plan drop: render functions); attributes fall through to the root instead. -->
  <ComboBox
    class="w-[256px]"
    data-custom="foo"
    label="Favorite Animal"
    placeholder="Search animals..."
    :items="animals"
  />
</template>
