<template>
  <NumberField
    v-model.nullable="discount"
    :min="0"
    :max="100"
    label="Discount"
    name="discount"
    :description="`Value: ${JSON.stringify(discount)}`"
    class="w-full max-w-64"
  />
</template>

<script setup lang="ts">
import { NumberField } from '@hareui/vue'
import { ref } from 'vue'

const discount = ref<number | null>(15)
</script>
