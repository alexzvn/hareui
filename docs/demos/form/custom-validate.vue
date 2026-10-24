<template>
  <Form class="flex w-96 flex-col gap-4" :validate="validate" :state="state" @submit="onSubmit">
    <TextField v-model="state.email" name="email" type="email" label="Email" />
    <TextField v-model="state.password" name="password" type="password" label="Password" />
    <TextField v-model="state.confirm" name="confirm" type="password" label="Confirm password" />
    <Button type="submit" class="self-start"> Submit </Button>
  </Form>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@hareui/vue'
import { Button, Form, TextField } from '@hareui/vue'
import { reactive } from 'vue'

type State = {
  email?: string
  password?: string
  confirm?: string
}

const state = reactive<State>({})

// Return one error per invalid field, keyed by the field's `name`
const validate = (state: Partial<State>): FormError[] => {
  const errors: FormError[] = []
  if (!state.email) errors.push({ name: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ name: 'password', message: 'Password is required' })
  if (state.confirm !== state.password)
    errors.push({ name: 'confirm', message: 'Passwords do not match' })
  return errors
}

const onSubmit = (event: FormSubmitEvent<State>) => {
  alert(`Valid: ${JSON.stringify(event.data, null, 2)}`)
}
</script>
