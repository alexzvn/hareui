<script setup lang="ts">
import type { FormSubmitEvent } from '@hareui/vue'
import { Button, Form, NumberField, TextField } from '@hareui/vue'
import { reactive } from 'vue'
import * as z from 'zod'

const schema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z
    .string('Password is required')
    .min(1, 'Password is required')
    .min(8, 'Must be at least 8 characters')
    .regex(/\d/, 'Must contain a number'),
  seats: z.number('Enter the number of seats').min(1, 'At least 1 seat').max(5, 'At most 5 seats'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  seats: 1,
})

function onSubmit(event: FormSubmitEvent<Schema>) {
  alert(`Valid: ${JSON.stringify(event.data, null, 2)}`)
}
</script>

<template>
  <Form class="flex w-96 flex-col gap-4" :schema="schema" :state="state" @submit="onSubmit">
    <TextField
      v-model="state.email"
      name="email"
      type="email"
      label="Email"
      placeholder="john@example.com"
    />
    <TextField v-model="state.password" name="password" type="password" label="Password" />
    <NumberField v-model="state.seats" name="seats" label="Seats" />
    <Button type="submit" class="self-start"> Submit </Button>
  </Form>
</template>
