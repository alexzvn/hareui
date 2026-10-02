<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Button, DateField, Form } from 'herouse'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

const value = ref<DateValue | null>(null)
const isSubmitting = ref(false)
const todayDate = today(getLocalTimeZone())
const isInvalid = computed(() => value.value !== null && value.value.compare(todayDate) < 0)

function handleSubmit(e: Event) {
  e.preventDefault()
  if (!value.value || isInvalid.value)
    return

  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    console.log('Date submitted:', { date: value.value })
    value.value = null
    isSubmitting.value = false
  }, 1500)
}
</script>

<template>
  <Form class="flex w-[280px] flex-col gap-4" @submit="handleSubmit">
    <DateField
      v-model="value"
      required
      class="w-full"
      :invalid="isInvalid"
      :min-value="todayDate"
      name="date"
      label="Appointment date"
      error-message="Date must be today or in the future"
      description="Enter a date from today onwards"
    >
      <template #prefix>
        <Icon class="size-4 text-muted" icon="gravity-ui:calendar" />
      </template>
    </DateField>
    <Button class="w-full" :disabled="!value || isInvalid" :pending="isSubmitting" type="submit" variant="primary">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </Button>
  </Form>
</template>
