<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { InputGroup, TextField } from 'herouse'
</script>

<template>
  <TextField class="w-full max-w-[280px]" name="email" label="Email address" description="We don't send spam">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" placeholder="name@email.com">
      <template #suffix>
        <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
      </template>
    </InputGroup>
  </TextField>
</template>
