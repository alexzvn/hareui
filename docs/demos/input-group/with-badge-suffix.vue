<script setup lang="ts">
import { Chip, InputGroup, TextField } from 'herouse'
</script>

<template>
  <TextField aria-label="Email address" class="w-full max-w-[280px]" name="email">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]', suffix: 'pe-2' }" placeholder="Email address">
      <template #suffix>
        <Chip color="accent" size="md" variant="soft">
          Pro
        </Chip>
      </template>
    </InputGroup>
  </TextField>
</template>
