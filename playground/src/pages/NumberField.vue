<script setup lang="ts">
import { NumberField } from 'herouse'
import { ref } from 'vue'

const width = ref<number | null>(1024)
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      NumberField
    </h1>
    <section class="flex flex-wrap items-start gap-6">
      <NumberField v-model="width" data-test="controlled" label="Width" :min="0" description="Enter the width in pixels" />
      <p data-test="value">
        {{ width }}
      </p>
      <NumberField label="Secondary" variant="secondary" :default-value="100" :min="0" />
      <NumberField label="Percentage" :default-value="0.5" :min="0" :max="1" :step="0.1" :format-options="{ style: 'percent' }" />
    </section>
    <section class="flex flex-wrap items-start gap-6">
      <NumberField label="Required" required :min="0" />
      <NumberField label="Disabled" disabled :default-value="1024" />
      <NumberField label="Read only" readonly :default-value="1024" />
      <NumberField label="Invalid" invalid :default-value="-5" error-message="Quantity must be greater than or equal to 0" />
      <NumberField label="No buttons" :increment="false" :decrement="false" :default-value="7" />
    </section>
    <section class="w-[400px]">
      <NumberField label="Full width" full-width :default-value="1024" />
    </section>
  </div>
</template>
