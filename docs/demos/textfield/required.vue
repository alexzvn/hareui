<script setup lang="ts">
import { TextField } from 'herouse'
</script>

<template>
  <TextField
    required
    class="w-full max-w-64"
    label="Full Name"
    name="fullName"
    placeholder="John Doe"
    description="This field is required"
  />
</template>
