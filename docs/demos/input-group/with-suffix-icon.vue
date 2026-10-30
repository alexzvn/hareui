<template>
  <TextField
    class="w-full max-w-[280px]"
    name="email"
    label="Email address"
    description="We don't send spam"
  >
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" placeholder="name@email.com">
      <template #suffix>
        <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
      </template>
    </InputGroup>
  </TextField>
</template>

<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
