<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { InputGroup, Surface, TextField } from 'herouse'
</script>

<template>
  <Surface class="rounded-2xl p-6">
    <TextField class="w-full max-w-[280px]" name="email" label="Email address" description="We'll never share this with anyone else">
      <InputGroup variant="secondary" :ui="{ input: 'w-full max-w-[280px]' }" placeholder="name@email.com">
        <template #prefix>
          <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
  </Surface>
</template>
