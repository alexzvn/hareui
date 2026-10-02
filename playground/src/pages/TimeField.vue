<script setup lang="ts">
import type { TimeValue } from 'reka-ui'
import { Time } from '@internationalized/date'
import { TimeField } from 'herouse'
import { ref } from 'vue'

const time = ref<TimeValue | null>(new Time(9, 30))
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      TimeField
    </h1>
    <section class="flex flex-wrap items-start gap-6">
      <TimeField v-model="time" data-test="controlled" label="Time" description="Enter a meeting time" />
      <p data-test="value">
        {{ time?.toString() }}
      </p>
      <TimeField label="Secondary" variant="secondary" :default-value="new Time(14, 0)" />
      <TimeField label="Granularity: second" granularity="second" :default-value="new Time(9, 30, 15)" />
      <TimeField label="12-hour" :hour-cycle="12" :default-value="new Time(14, 0)" />
    </section>
    <section class="flex flex-wrap items-start gap-6">
      <TimeField label="Required" required />
      <TimeField label="Disabled" disabled :default-value="new Time(9, 30)" />
      <TimeField label="Read only" readonly :default-value="new Time(9, 30)" />
      <TimeField label="Invalid" invalid :default-value="new Time(9, 30)" error-message="Time must be between 9:00 AM and 5:00 PM" />
      <TimeField label="Min/Max" :min-value="new Time(9, 0)" :max-value="new Time(17, 0)" />
    </section>
    <section class="w-[400px]">
      <TimeField label="Full width" full-width :default-value="new Time(9, 30)" />
    </section>
  </div>
</template>
