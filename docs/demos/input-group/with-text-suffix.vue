<script setup lang="ts">
import { InputGroup, TextField } from 'herouse'
</script>

<template>
  <TextField class="w-full max-w-[280px]" default-value="heroui" name="website" label="Website">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" suffix=".com" />
  </TextField>
</template>
