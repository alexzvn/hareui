<script setup lang="ts">
import { Button, Card, Input, Label, Link, TextField } from '@hareui/vue'

function onSubmit(e: Event) {
  e.preventDefault()
  alert('Form submitted successfully!')
}
</script>

<template>
  <Card class="w-full max-w-md" description="Enter your credentials to access your account" title="Login">
    <form @submit="onSubmit">
      <div class="flex flex-col gap-4">
        <TextField name="email" type="email">
          <Label>Email</Label>
          <Input placeholder="email@example.com" variant="secondary" />
        </TextField>
        <TextField name="password" type="password">
          <Label>Password</Label>
          <Input placeholder="••••••••" variant="secondary" />
        </TextField>
      </div>
      <div class="mt-4 flex flex-col items-center gap-2">
        <Button class="w-full" type="submit">Sign In</Button>
        <Link class="text-center text-sm" href="#">
          Forgot password?
        </Link>
      </div>
    </form>
  </Card>
</template>
