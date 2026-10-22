<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
import { computed, reactive } from 'vue'

const items = [
  { key: 'sourdough', name: 'Sourdough', price: 6.5, max: 3 },
  { key: 'croissant', name: 'Croissant', price: 2.2, max: 12 },
  { key: 'baguette', name: 'Baguette', price: 3, max: 6 },
  { key: 'cinnamon', name: 'Cinnamon roll', price: 3.8, max: 8 },
] as const

const order = reactive<Record<(typeof items)[number]['key'], number | null>>({ sourdough: 1, croissant: 4, baguette: 0, cinnamon: 2 })

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })
const total = computed(() => items.reduce((sum, item) => sum + item.price * (order[item.key] ?? 0), 0))
const count = computed(() => items.reduce((sum, item) => sum + (order[item.key] ?? 0), 0))
</script>

<template>
  <div class="w-[420px] max-w-full overflow-hidden rounded-2xl border border-border">
    <div class="grid grid-cols-2 gap-px bg-border">
      <div v-for="item in items" :key="item.key" class="flex flex-col items-center gap-3 bg-background p-4 text-center">
        <div>
          <p class="text-sm font-medium text-foreground">
            {{ item.name }}
          </p>
          <p class="text-xs text-muted">
            {{ euro.format(item.price) }} each · up to {{ item.max }}
          </p>
        </div>
        <NumberStepper v-model="order[item.key]" :aria-label="item.name" size="sm" :min="0" :max="item.max" />
      </div>
    </div>
    <div class="flex items-center justify-between border-t border-border bg-default px-4 py-3 text-sm">
      <span class="text-muted">{{ count }} {{ count === 1 ? 'item' : 'items' }}</span>
      <span class="font-semibold text-foreground tabular-nums">{{ euro.format(total) }}</span>
    </div>
  </div>
</template>
