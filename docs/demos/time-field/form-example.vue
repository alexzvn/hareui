<template>
  <Form class="flex w-[280px] flex-col gap-4" @submit="handleSubmit">
    <TimeField
      v-model="value"
      required
      class="w-full"
      :invalid="isInvalid"
      :min-value="minTime"
      :max-value="maxTime"
      name="time"
      label="Appointment time"
      error-message="Time must be between 9:00 AM and 5:00 PM"
      description="Enter a time between 9:00 AM and 5:00 PM"
    >
      <template #prefix>
        <Icon class="size-4 text-muted" icon="gravity-ui:clock" />
      </template>
    </TimeField>
    <Button
      class="w-full"
      :disabled="!value || isInvalid"
      :pending="isSubmitting"
      type="submit"
      variant="primary"
    >
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </Button>
  </Form>
</template>

<script setup lang="ts">
import { Button, Form, TimeField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import type { Time } from '@internationalized/date'
import { parseTime } from '@internationalized/date'
import { computed, ref, shallowRef } from 'vue'

const value = shallowRef<Time | null>(null)
const isSubmitting = ref(false)
const minTime = parseTime('09:00')
const maxTime = parseTime('17:00')
const isInvalid = computed(
  () =>
    value.value !== null && (value.value.compare(minTime) < 0 || value.value.compare(maxTime) > 0),
)

const handleSubmit = (e: Event) => {
  e.preventDefault()
  if (!value.value || isInvalid.value) return

  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    console.log('Time submitted:', { time: value.value })
    value.value = null
    isSubmitting.value = false
  }, 1500)
}
</script>
