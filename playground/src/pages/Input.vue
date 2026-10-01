<script setup lang="ts">
import { Input } from 'herouse'
import { ref } from 'vue'

const value = ref('heroui.com')
const variants = ['primary', 'secondary'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Input</h1>
    <section v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-4">
      <h2 class="w-24 text-sm text-muted">{{ variant }}</h2>
      <Input :variant="variant" placeholder="Enter your name" />
      <Input :variant="variant" model-value="With value" />
      <Input :variant="variant" disabled placeholder="Disabled" />
      <Input :variant="variant" invalid placeholder="Invalid" />
      <Input :variant="variant" required placeholder="Required" />
    </section>
    <section class="w-[400px]">
      <Input full-width placeholder="Full width" />
    </section>
    <section class="flex items-center gap-4">
      <Input v-model="value" aria-label="Domain" />
      <span class="text-sm text-muted">https://{{ value }}</span>
    </section>
    <section class="flex items-center gap-4">
      <Input type="number" :min="0" placeholder="30" />
      <Input type="password" placeholder="••••••••" />
      <Input :ui="{ base: 'rounded-none font-mono' }" placeholder=":ui override" />
    </section>
  </div>
</template>
