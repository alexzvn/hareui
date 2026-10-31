<template>
  <div class="flex flex-col gap-4">
    <NumberValue class="text-2xl font-semibold" :value="12840">
      <template #suffix>
        <span class="text-sm font-normal text-muted"> downloads</span>
      </template>
    </NumberValue>
    <NumberValue class="text-2xl font-semibold" :value="24" format="currency" currency="USD">
      <template #prefix>
        <span class="text-sm font-normal text-muted">from </span>
      </template>
      <template #suffix>
        <span class="text-sm font-normal text-muted">/seat</span>
      </template>
    </NumberValue>
    <NumberValue class="text-2xl font-semibold" :value="4.8" :minimum-fraction-digits="1">
      <template #suffix>
        <span class="text-sm font-normal text-muted"> / 5</span>
      </template>
    </NumberValue>
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'
</script>
