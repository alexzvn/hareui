<script setup lang="ts">
import { Input } from '@hareui/vue'
</script>

<template>
  <div class="flex w-[240px] flex-col gap-2">
    <Input full-width placeholder="Primary input" variant="primary" />
    <Input full-width placeholder="Secondary input" variant="secondary" />
  </div>
</template>
