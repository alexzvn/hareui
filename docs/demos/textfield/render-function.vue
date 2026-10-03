<script setup lang="ts">
import { TextField } from '@hareui/vue'
</script>

<template>
  <!-- Attributes other than aria-label/aria-labelledby fall through to the root element (HeroUI's `render` prop) -->
  <TextField
    class="w-full max-w-64"
    data-custom="foo"
    label="Email"
    name="email"
    placeholder="Enter your email"
    type="email"
  />
</template>
