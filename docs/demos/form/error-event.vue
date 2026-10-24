<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@hareui/vue'
import { Button, Form, TextField } from '@hareui/vue'
import { reactive } from 'vue'
import * as z from 'zod'

const schema = z.object({
  name: z
    .string('Name is required')
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

function onSubmit(event: FormSubmitEvent<Schema>) {
  alert(`Valid: ${JSON.stringify(event.data, null, 2)}`)
}

// Move focus to the first invalid field
function onError(event: FormErrorEvent) {
  const id = event.errors[0]?.id
  if (id) {
    const element = document.getElementById(id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <Form
    class="flex w-96 flex-col gap-4"
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    @error="onError"
  >
    <TextField v-model="state.name" name="name" label="Name" />
    <TextField v-model="state.email" name="email" type="email" label="Email" />
    <Button type="submit" class="self-start"> Submit </Button>
  </Form>
</template>
