<template>
  <FormField label="Billing email" required class="w-80">
    <TextField type="email" placeholder="billing@studio.dev" full-width />
  </FormField>
</template>

<script setup lang="ts">
import { FormField, TextField } from '@hareui/vue'
</script>
