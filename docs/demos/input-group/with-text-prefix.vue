<template>
  <TextField
    class="w-full max-w-[280px]"
    default-value="example.com"
    name="website"
    label="Website"
  >
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" prefix="https://" />
  </TextField>
</template>

<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
</script>
