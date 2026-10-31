<template>
  <!-- Attributes other than aria-label/aria-labelledby fall through to the root element -->
  <TextField
    class="w-full max-w-64"
    data-testid="signup-email"
    label="Email"
    name="email"
    placeholder="Enter your email"
    type="email"
  />
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
</script>
