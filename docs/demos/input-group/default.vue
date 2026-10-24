<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <TextField class="w-full max-w-[280px]" name="email" label="Email address">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" placeholder="name@email.com">
      <template #prefix>
        <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
      </template>
    </InputGroup>
  </TextField>
</template>
