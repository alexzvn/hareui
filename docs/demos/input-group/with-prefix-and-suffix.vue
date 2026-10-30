<template>
  <TextField
    class="w-full max-w-[280px]"
    default-value="10"
    name="price"
    label="Set a price"
    description="What customers would pay"
  >
    <InputGroup :ui="{ input: 'w-full max-w-[200px]' }" type="number" prefix="$" suffix="USD" />
  </TextField>
</template>

<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
</script>
