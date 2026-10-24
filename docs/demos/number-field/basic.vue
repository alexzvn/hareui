<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>

<template>
  <NumberField
    class="w-full max-w-64"
    :default-value="1024"
    :min="0"
    name="width"
    label="Width"
    :ui="{ input: 'w-[120px]' }"
  />
</template>
