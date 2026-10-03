<script setup lang="ts">
import { ComboBox } from '@hareui/vue'

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
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Focus (default)
      </p>
      <ComboBox class="w-[256px]" menu-trigger="focus" label="Favorite Animal" placeholder="Search animals..." description="Popover opens when the input is focused" :items="animals" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Input
      </p>
      <ComboBox class="w-[256px]" menu-trigger="input" label="Favorite Animal" placeholder="Search animals..." description="Popover opens when the user edits the input text" :items="animals" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Manual
      </p>
      <ComboBox class="w-[256px]" menu-trigger="manual" label="Favorite Animal" placeholder="Search animals..." description="Popover only opens when the trigger button is pressed or arrow keys are used" :items="animals" />
    </div>
  </div>
</template>
