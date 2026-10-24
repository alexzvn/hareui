<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { InlineSelect } from '@hareui/vue'
import { computed, ref } from 'vue'

type Side = 'top' | 'right' | 'bottom' | 'left'
type Align = 'start' | 'center' | 'end'

const sides: Side[] = ['bottom', 'top', 'left', 'right']
const aligns: Align[] = ['start', 'center', 'end']

interface Placement extends ListBoxItem {
  side: Side
  align: Align
}

// One option per side / align pair, e.g. "Bottom · End"
const placements: Placement[] = sides.flatMap(side => aligns.map(align => ({
  value: `${side}-${align}`,
  label: `${side[0]!.toUpperCase()}${side.slice(1)} · ${align[0]!.toUpperCase()}${align.slice(1)}`,
  side,
  align,
})))

const placement = ref<SelectValue>('bottom-end')
const current = computed(() => placements.find(p => p.value === placement.value) ?? placements[2]!)
</script>

<template>
  <div class="flex items-center justify-center px-10">
    <InlineSelect
      v-model="placement"
      aria-label="Popover placement"
      :items="placements"
      :side="current.side"
      :align="current.align"
      :ui="{ popover: 'w-44' }"
    />
  </div>
</template>
