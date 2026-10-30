<template>
  <form class="flex w-[280px] flex-col gap-4" @submit="onSubmit">
    <NumberField
      v-model="value"
      required
      :invalid="isOutOfStock"
      :max="5"
      :min="1"
      name="quantity"
      label="Order quantity"
      :description="`Only ${STOCK_AVAILABLE} items available`"
      :error-message="`Only ${STOCK_AVAILABLE} items left in stock`"
      :ui="{ input: 'w-[120px]' }"
    />
    <Button
      class="w-full"
      :disabled="value == null || value < 1 || value > STOCK_AVAILABLE"
      :pending="isSubmitting"
      type="submit"
      variant="primary"
    >
      {{ isSubmitting ? 'Processing...' : 'Place Order' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { Button, NumberField } from '@hareui/vue'
import { computed, ref } from 'vue'

const STOCK_AVAILABLE = 3
const value = ref<number | null>()
const isSubmitting = ref(false)
const isOutOfStock = computed(() => value.value != null && value.value > STOCK_AVAILABLE)

const onSubmit = (e: Event) => {
  e.preventDefault()
  if (value.value == null || value.value < 1 || value.value > STOCK_AVAILABLE) return
  isSubmitting.value = true

  // Simulate API call
  setTimeout(() => {
    console.log('Order submitted:', { quantity: value.value })
    value.value = undefined
    isSubmitting.value = false
  }, 1500)
}
</script>
