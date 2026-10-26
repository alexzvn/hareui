<template>
  <div class="w-[400px] space-y-4">
    <TextField full-width label="Your name" name="name" placeholder="John" />
    <TextField
      full-width
      invalid
      required
      label="Password"
      name="password"
      type="password"
      error-message="Password must be longer than 8 characters"
    />
  </div>
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
</script>
