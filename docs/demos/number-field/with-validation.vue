<script setup lang="ts">
import { NumberField } from 'herouse'
import { computed, ref } from 'vue'

const value = ref<number | null>()
const isInvalid = computed(() => value.value != null && (value.value < 0 || value.value > 100))
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <NumberField
      v-model="value"
      required
      :format-options="{ style: 'percent' }"
      :invalid="isInvalid"
      :max="1"
      :min="0"
      name="percentage"
      :step="0.1"
      label="Percentage"
      description="Enter a value between 0 and 100"
      error-message="Percentage must be between 0 and 100"
      :ui="{ input: 'w-[120px]' }"
    />
  </div>
</template>
