<script setup lang="ts">
import { Button, Card, Input, Label, TextField } from 'herouse'

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
        <!-- herouse has no Link component yet: this is HeroUI's Link markup -->
        <a
          class="relative inline-flex h-fit w-fit items-center rounded-xl text-center text-sm font-medium text-link no-underline decoration-separator-tertiary decoration-[1.5px] underline-offset-4 no-highlight transition-colors duration-100 ease-smooth focus-visible:status-focused motion-reduce:transition-none hover:underline hover:decoration-muted/50 active:underline active:decoration-muted"
          href="#"
        >
          Forgot password?
        </a>
      </div>
    </form>
  </Card>
</template>
