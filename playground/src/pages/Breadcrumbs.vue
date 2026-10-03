<script setup lang="ts">
import { Breadcrumbs } from '@hareui/vue'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Electronics', href: '#' },
  { label: 'Laptop' },
]
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Breadcrumbs</h1>
    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default</h2>
      <Breadcrumbs :items="items" />
    </section>
    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">disabled</h2>
      <Breadcrumbs :items="items" disabled />
    </section>
    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">#separator / #item</h2>
      <Breadcrumbs :items="items">
        <template #separator><span>/</span></template>
        <template #item="{ item, current }"><span :class="current ? 'underline' : undefined">{{ item.label }}</span></template>
      </Breadcrumbs>
    </section>
  </div>
</template>
