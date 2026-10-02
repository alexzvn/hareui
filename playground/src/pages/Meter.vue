<script setup lang="ts">
import { Button, Meter } from 'herouse'
import { ref } from 'vue'

const sizes = ['sm', 'md', 'lg'] as const
const colors = ['default', 'accent', 'success', 'warning', 'danger'] as const
const value = ref(30)
</script>

<template>
  <div class="flex max-w-md flex-col gap-8">
    <h1 class="text-xl font-semibold">Meter</h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">Sizes</h2>
      <Meter v-for="size in sizes" :key="size" :label="size" :size="size" :value="60" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">Colors</h2>
      <Meter v-for="color in colors" :key="color" :color="color" :label="color" :value="50" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">States</h2>
      <Meter aria-label="No label" :value="45" />
      <Meter label="Revenue" :format-options="{ style: 'currency', currency: 'USD' }" :max-value="1000" :value="750" />
      <Meter label="Steps" :max-value="4" :value="3" value-label="3 of 4" />
      <Meter aria-disabled="true" label="Disabled" :value="40" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">Interactive</h2>
      <Meter label="Value" :value="value" />
      <div class="flex gap-2">
        <Button size="sm" variant="secondary" @click="value = Math.max(0, value - 10)">-10</Button>
        <Button size="sm" variant="secondary" @click="value = Math.min(100, value + 10)">+10</Button>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">ui override</h2>
      <Meter label="Rounded" :ui="{ track: 'h-3 rounded-full', fill: 'rounded-full' }" :value="70" />
    </section>
  </div>
</template>
