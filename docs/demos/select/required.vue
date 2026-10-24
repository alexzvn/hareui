<template>
  <Form class="flex w-[256px] flex-col gap-4" @submit.prevent="onSubmit">
    <Select
      required
      class="w-full"
      label="State"
      name="state"
      placeholder="Select one"
      :items="states"
    />
    <Select
      required
      class="w-full"
      label="Country"
      name="country"
      placeholder="Select a country"
      :items="countries"
    />
    <Button type="submit"> Submit </Button>
  </Form>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Button, Form, Select } from '@hareui/vue'

const states: ListBoxItem[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]
const countries: ListBoxItem[] = [
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Germany' },
]

function onSubmit(event: SubmitEvent) {
  const data = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement))
  console.log('Form submitted:', data)
  alert('Form submitted successfully!')
}
</script>
