<script setup lang="ts">
import { Input, TextField } from 'herouse'
</script>

<template>
  <div>
    <TextField
      required
      name="name"
      label="Your email"
      description="We won't share your email"
      error-message="The email is invalid"
      class="items-start"
      :ui="{ base: '[&>[data-slot=description]]:mt-0.5' }"
    >
      <Input class="w-[256px]" placeholder="john@email.com" />
    </TextField>
  </div>
</template>
