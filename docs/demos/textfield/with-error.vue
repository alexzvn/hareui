<template>
  <TextField
    invalid
    class="w-full max-w-64"
    label="Email"
    name="email"
    placeholder="user@example.com"
    type="email"
    error-message="Please enter a valid email address"
  />
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
</script>
