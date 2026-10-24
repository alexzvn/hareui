<template>
  <Form class="flex w-72 flex-col gap-3" @submit="handleSubmit">
    <DatePicker
      v-model="value"
      required
      :invalid="isInvalid"
      :min-value="todayDate"
      name="appointmentDate"
      label="Appointment date"
      calendar-label="Event date"
      error-message="Date must be today or in the future."
      description="Choose a valid appointment date."
    />
    <Button class="w-full" :disabled="!value || isInvalid" :pending="isSubmitting" type="submit">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </Button>
  </Form>
</template>

<script setup lang="ts">
import { Button, DatePicker, Form } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, shallowRef } from 'vue'

const value = shallowRef<DateValue | null>(null)
const isSubmitting = ref(false)
const todayDate = today(getLocalTimeZone())
const isInvalid = computed(() => value.value !== null && value.value.compare(todayDate) < 0)

function handleSubmit(e: Event) {
  e.preventDefault()
  if (!value.value || isInvalid.value) return

  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    console.log('Date submitted:', { appointmentDate: value.value })
    value.value = null
    isSubmitting.value = false
  }, 1200)
}
</script>
