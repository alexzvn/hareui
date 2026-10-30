<template>
  <TextField class="w-full max-w-[280px]" default-value="example" name="website" label="Website">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" suffix=".com" />
  </TextField>
</template>

<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
</script>
