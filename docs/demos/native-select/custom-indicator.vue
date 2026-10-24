<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces' },
  { value: '8', label: '8 spaces' },
  { value: 'tab', label: 'Tabs' },
]
</script>

<template>
  <div class="w-[220px]">
    <NativeSelect full-width label="Indentation" name="indentation" default-value="2" :items="items">
      <template #indicator>
        <Icon icon="gravity-ui:chevrons-expand-vertical" />
      </template>
    </NativeSelect>
  </div>
</template>
