<script setup lang="ts">
import { InputGroup, Spinner, TextField } from 'herouse'
</script>

<template>
  <TextField class="w-full max-w-[280px]" default-value="Sending..." name="status">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }">
      <template #suffix>
        <Spinner class="size-4" />
      </template>
    </InputGroup>
  </TextField>
</template>
