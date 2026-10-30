<template>
  <CommandPalette
    :groups="groups"
    virtualize
    :fuse="{ resultLimit: 5000 }"
    :autofocus="false"
    placeholder="Search 5,000 invoices..."
    class="h-80 w-full max-w-md rounded-2xl bg-surface shadow-surface"
  />
</template>

<script setup lang="ts">
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'

const customers = ['Birch & Co', 'Northwind', 'Kettle Labs', 'Sola Studio', 'Pine Freight']

const groups: CommandPaletteGroup[] = [
  {
    id: 'invoices',
    items: Array.from({ length: 5000 }, (_, index) => ({
      label: `Invoice #${String(index + 1).padStart(4, '0')}`,
      suffix: customers[index % customers.length],
    })),
  },
]
</script>
