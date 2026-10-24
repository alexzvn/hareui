<script setup lang="ts">
import { Button, DatePicker, Description } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateValue | null>(today(getLocalTimeZone()))
</script>

<template>
  <div class="flex w-72 flex-col gap-4">
    <DatePicker v-model="value" name="date" label="Date" calendar-label="Event date" />
    <Description>Current value: {{ value ? value.toString() : '(empty)' }}</Description>
    <div class="flex gap-2">
      <Button variant="tertiary" @click="value = today(getLocalTimeZone())"> Set today </Button>
      <Button variant="tertiary" @click="value = null"> Clear </Button>
    </div>
  </div>
</template>
