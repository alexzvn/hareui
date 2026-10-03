<script setup lang="ts">
import type { DateRangeValue } from 'herouse'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Button, DateRangePicker, Form } from 'herouse'
import { computed, ref, shallowRef } from 'vue'

const value = shallowRef<DateRangeValue | null>(null)
const isSubmitting = ref(false)
const currentDate = today(getLocalTimeZone())
const isInvalid = computed(() => value.value != null && (value.value.start.compare(currentDate) < 0 || value.value.end.compare(value.value.start) < 0))

function handleSubmit(event: Event) {
  event.preventDefault()
  if (!value.value || isInvalid.value)
    return

  isSubmitting.value = true
  setTimeout(() => {
    value.value = null
    isSubmitting.value = false
  }, 1200)
}
</script>

<template>
  <Form class="flex w-80 flex-col gap-3" @submit="handleSubmit">
    <DateRangePicker
      v-model="value"
      required
      full-width
      :invalid="isInvalid"
      :min-value="currentDate"
      start-name="tripStartDate"
      end-name="tripEndDate"
      label="Trip dates"
      calendar-label="Trip dates"
      description="Select your check-in and check-out dates."
      error-message="Please choose a valid range in the future."
    />
    <Button class="w-full" :disabled="!value || isInvalid" :pending="isSubmitting" type="submit">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </Button>
  </Form>
</template>
