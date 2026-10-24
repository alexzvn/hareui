<template>
  <div class="grid w-80 gap-3">
    <CellSelect v-model="font" :items="fonts" label="Editor font" :ui="{ indicator: 'hidden' }">
      <template #value="{ text }">
        <span :style="{ fontFamily: String(font) }">{{ text }}</span>
      </template>
      <template #item="{ item }">
        <span :style="{ fontFamily: String(item.value) }">{{ item.label }}</span>
      </template>
    </CellSelect>
    <pre
      class="overflow-x-auto rounded-xl bg-default px-4 py-3 text-xs leading-5"
      :style="{ fontFamily: String(font) }"
    >
const greet = (name) =&gt; {
  return `Hi, ${name}!`
}</pre>
  </div>
</template>

<script setup lang="ts">
import type { SelectValue } from '@hareui/vue'
import { CellSelect } from '@hareui/vue'
import { ref } from 'vue'

const fonts = [
  { value: 'ui-monospace, monospace', label: 'System mono' },
  { value: 'Menlo, monospace', label: 'Menlo' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: 'Georgia, serif', label: 'Georgia' },
]

const font = ref<SelectValue>('Menlo, monospace')
</script>
