<script setup lang="ts">
import { Chip } from 'herouse'
import { Icon } from '../icons'

const colors = ['default', 'accent', 'success', 'warning', 'danger'] as const
const variants = ['primary', 'secondary', 'tertiary', 'soft'] as const
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Chip</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Colors</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Chip v-for="color in colors" :key="color" :color="color" :label="color" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Variants</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Chip v-for="variant in variants" :key="variant" color="accent" :label="variant" :variant="variant" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sizes</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Chip v-for="size in sizes" :key="size" label="Label" :size="size" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots (leading / trailing)</h2>
      <div class="flex flex-wrap items-center gap-3">
        <Chip color="success" label="Available">
          <template #leading><Icon icon="gravity-ui:circle-check-fill" width="12" /></template>
        </Chip>
        <Chip color="accent" label="Label">
          <template #trailing><Icon icon="gravity-ui:chevron-down" width="12" /></template>
        </Chip>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Chip
        label="Draft"
        :ui="{ base: 'rounded-full bg-default-soft px-3 text-default-soft-foreground' }"
      />
    </section>
  </div>
</template>
