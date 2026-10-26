<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar
      aria-label="Event dates"
      selection-mode="multiple"
      :model-value="value"
      @update:model-value="(v) => (value = v as DateValue[])"
    />
    <Description class="text-center">
      {{ value.length ? `${value.length} date(s) selected` : 'Select multiple dates' }}
    </Description>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Description } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateValue[]>([])
</script>
