<script setup lang="ts">
import { InputGroup, Kbd, TextField } from '@hareui/vue'
</script>

<template>
  <TextField aria-label="Command" class="w-full max-w-[280px]" name="command">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]', suffix: 'pe-2' }" placeholder="Command">
      <template #suffix>
        <Kbd keys="command">
          K
        </Kbd>
      </template>
    </InputGroup>
  </TextField>
</template>
