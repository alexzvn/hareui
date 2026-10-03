<script setup lang="ts">
import { Button, ProgressCircle } from '@hareui/vue'
import { ref } from 'vue'

const sizes = ['sm', 'md', 'lg'] as const
const colors = ['default', 'accent', 'success', 'warning', 'danger'] as const
const value = ref(30)
</script>

<template>
  <div class="flex max-w-md flex-col gap-8">
    <h1 class="text-xl font-semibold">ProgressCircle</h1>

    <section class="flex items-center gap-4">
      <ProgressCircle v-for="size in sizes" :key="size" :aria-label="size" :size="size" :value="60" />
    </section>

    <section class="flex items-center gap-4">
      <ProgressCircle v-for="color in colors" :key="color" :aria-label="color" :color="color" :value="60" />
    </section>

    <section class="flex items-center gap-4">
      <ProgressCircle aria-label="Indeterminate" indeterminate />
      <ProgressCircle aria-label="Thin" :stroke-width="2" :value="60" />
      <ProgressCircle aria-label="Thick" :stroke-width="6" :value="60" />
    </section>

    <section class="flex items-center gap-4">
      <ProgressCircle aria-label="Value" :value="value" />
      <Button size="sm" variant="secondary" @click="value = Math.max(0, value - 10)">-10</Button>
      <Button size="sm" variant="secondary" @click="value = Math.min(100, value + 10)">+10</Button>
    </section>
  </div>
</template>
