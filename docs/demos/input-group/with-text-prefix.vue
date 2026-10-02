<script setup lang="ts">
import { InputGroup, TextField } from 'herouse'
</script>

<template>
  <TextField class="w-full max-w-[280px]" default-value="heroui.com" name="website" label="Website">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" prefix="https://" />
  </TextField>
</template>
