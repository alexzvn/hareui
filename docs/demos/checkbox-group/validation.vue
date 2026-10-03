<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { Button, CheckboxGroup, Form } from '@hareui/vue'
import { ref } from 'vue'

const message = ref<string | null>(null)

const items: CheckboxGroupItem[] = [
  { value: 'email', label: 'Email notifications' },
  { value: 'sms', label: 'SMS notifications' },
  { value: 'push', label: 'Push notifications' },
]

function onSubmit(e: Event) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  const values = formData.getAll('preferences')
  message.value = `Selected preferences: ${values.join(', ')}`
}
</script>

<template>
  <Form class="flex flex-col gap-4" @submit="onSubmit">
    <CheckboxGroup
      required
      name="preferences"
      label="Preferences"
      error-message="Please select at least one notification method."
      :items="items"
    />
    <Button class="mt-2 w-fit" type="submit">
      Submit
    </Button>
    <p v-if="!!message" class="text-sm text-muted">
      {{ message }}
    </p>
  </Form>
</template>
