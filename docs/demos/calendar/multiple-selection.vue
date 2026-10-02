<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { Calendar, Description } from 'herouse'
import { ref } from 'vue'

const value = ref<readonly DateValue[]>([])
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar
      aria-label="Event dates"
      selection-mode="multiple"
      :model-value="value"
      @update:model-value="v => value = v as readonly DateValue[]"
    />
    <Description class="text-center">
      {{ value.length ? `${value.length} date(s) selected` : 'Select multiple dates' }}
    </Description>
  </div>
</template>
