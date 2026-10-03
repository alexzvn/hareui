<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, Form, TextField } from '@hareui/vue'

function onSubmit(e: Event) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  const data: Record<string, string> = {}
  // Convert FormData to plain object
  formData.forEach((value, key) => {
    data[key] = value.toString()
  })
  alert(`Form submitted with: ${JSON.stringify(data, null, 2)}`)
}

function validateEmail(value: string | number) {
  if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(value)))
    return 'Please enter a valid email address'
  return null
}

function validatePassword(value: string | number) {
  const password = String(value)
  if (password.length < 8)
    return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password))
    return 'Password must contain at least one uppercase letter'
  if (!/\d/.test(password))
    return 'Password must contain at least one number'
  return null
}
</script>

<template>
  <Form class="flex w-96 flex-col gap-4" @submit="onSubmit">
    <TextField
      required
      name="email"
      type="email"
      label="Email"
      placeholder="john@example.com"
      :validate="validateEmail"
    />
    <TextField
      required
      minlength="8"
      name="password"
      type="password"
      label="Password"
      placeholder="Enter your password"
      description="Must be at least 8 characters with 1 uppercase and 1 number"
      :validate="validatePassword"
    />
    <div class="flex gap-2">
      <Button type="submit">
        <Icon icon="gravity-ui:check" />
        Submit
      </Button>
      <Button type="reset" variant="secondary">
        Reset
      </Button>
    </div>
  </Form>
</template>
