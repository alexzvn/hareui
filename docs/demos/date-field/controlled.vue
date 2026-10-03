<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Button, DateField } from '@hareui/vue'
import { ref } from 'vue'

const value = ref<DateValue | null>(null)
</script>

<template>
  <div class="flex flex-col gap-4">
    <DateField v-model="value" class="w-[256px]" name="date" label="Date" :description="`Current value: ${value ? value.toString() : '(empty)'}`" />
    <div class="flex gap-2">
      <Button variant="tertiary" @click="value = today(getLocalTimeZone())">
        Set today
      </Button>
      <Button variant="tertiary" @click="value = null">
        Clear
      </Button>
    </div>
  </div>
</template>
