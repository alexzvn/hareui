<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>

<template>
  <!-- HeroUI stacks the buttons in a wrapper <div>; HareUI renders the group itself, so the grid places them instead -->
  <NumberField
    class="w-full max-w-64"
    :default-value="99"
    :min="0"
    name="amount"
    :format-options="{ currency: 'EUR', currencySign: 'accounting', style: 'currency' }"
    label="Number field with chevrons"
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
      <svg
        aria-hidden="true"
        height="11"
        viewBox="0 0 16 16"
        width="11"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M13.03 10.53a.75.75 0 0 1-1.06 0L8 6.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </template>
    <template #decrement>
      <svg
        aria-hidden="true"
        height="11"
        viewBox="0 0 16 16"
        width="11"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </template>
  </NumberField>
</template>
