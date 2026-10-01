<script setup lang="ts">
import { TextField } from 'herouse'
</script>

<template>
  <TextField
    disabled
    class="w-full max-w-64"
    name="accountId"
    model-value="USR-12345"
    label="Account ID"
    placeholder="Auto-generated"
    description="This field cannot be edited"
  />
</template>
