<template>
  <div class="flex flex-col gap-4">
    <DateField
      v-model="value"
      class="w-[256px]"
      name="date"
      label="Date"
      :description="`Current value: ${value ? value.toString() : '(empty)'}`"
    />
    <div class="flex gap-2">
      <Button variant="tertiary" @click="value = today(getLocalTimeZone())"> Set today </Button>
      <Button variant="tertiary" @click="value = null"> Clear </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, DateField } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateValue | null>(null)
</script>
