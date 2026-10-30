<template>
  <!-- Attributes other than aria-label/aria-labelledby fall through to the root element -->
  <NumberField
    class="w-full max-w-64"
    data-custom="foo"
    :default-value="1024"
    :min="0"
    name="width"
    label="Width"
    :ui="{ input: 'w-[120px]' }"
  />
</template>

<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>
