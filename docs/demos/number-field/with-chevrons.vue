<template>
  <!-- The group's grid stacks the two buttons -->
  <NumberField
    class="w-full max-w-64"
    :default-value="99"
    :min="0"
    name="amount"
    :format-options="{ currency: 'EUR', currencySign: 'accounting', style: 'currency' }"
    label="Price"
    :ui="{
      group: 'grid-rows-2 has-[[slot=decrement]]:has-[[slot=increment]]:grid-cols-[1fr_24px]',
      input: 'col-start-1 row-span-2 row-start-1',
      incrementButton:
        'col-start-2 row-start-1 flex h-full w-6 items-center justify-center rounded-none border-0 border-s border-field-placeholder/15 pt-0.5 text-sm',
      decrementButton:
        'col-start-2 row-start-2 flex h-full w-6 items-center justify-center rounded-none border-0 border-s border-field-placeholder/15 pb-0.5 text-sm',
    }"
  >
    <template #increment>
      <Icon icon="gravity-ui:chevron-up" class="size-3" />
    </template>
    <template #decrement>
      <Icon icon="gravity-ui:chevron-down" class="size-3" />
    </template>
  </NumberField>
</template>

<script setup lang="ts">
import { NumberField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
