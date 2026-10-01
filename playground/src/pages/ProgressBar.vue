<script setup lang="ts">
import { Button, ProgressBar } from 'herouse'
import { ref } from 'vue'

const sizes = ['sm', 'md', 'lg'] as const
const colors = ['default', 'accent', 'success', 'warning', 'danger'] as const
const value = ref(30)
</script>

<template>
  <div class="flex max-w-md flex-col gap-8">
    <h1 class="text-xl font-semibold">ProgressBar</h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">Sizes</h2>
      <ProgressBar v-for="size in sizes" :key="size" :label="size" :size="size" :value="60" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">Colors</h2>
      <ProgressBar v-for="color in colors" :key="color" :color="color" :label="color" :value="50" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">States</h2>
      <ProgressBar aria-label="No label" :value="45" />
      <ProgressBar indeterminate label="Indeterminate" />
      <ProgressBar label="Revenue" :format-options="{ style: 'currency', currency: 'USD' }" :max-value="1000" :min-value="200" :value="750" />
      <ProgressBar label="Steps" :max-value="4" :value="3" value-label="3 of 4" />
      <ProgressBar aria-disabled="true" label="Disabled" :value="40" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">Transition + #output slot</h2>
      <ProgressBar label="Uploading" :value="value">
        <template #output="{ valueText }">
          {{ valueText }} done
        </template>
      </ProgressBar>
      <Button class="w-fit" size="sm" @click="value = (value + 25) % 125">
        Advance
      </Button>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-sm font-medium text-muted">:ui override</h2>
      <ProgressBar label="Rounded" :ui="{ track: 'h-3 rounded-full', fill: 'rounded-full' }" :value="70" />
    </section>
  </div>
</template>
