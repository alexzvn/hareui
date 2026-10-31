<template>
  <div class="flex flex-col gap-1">
    <span class="text-sm text-muted">Monthly active readers</span>
    <NumberValue class="text-2xl font-semibold" :value="48213" />
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'
</script>
