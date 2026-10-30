<template>
  <div class="flex flex-col gap-4">
    <TextField
      disabled
      class="w-full max-w-[280px]"
      default-value="name@email.com"
      name="email"
      label="Email address"
    >
      <InputGroup :ui="{ input: 'w-full max-w-[280px]' }">
        <template #prefix>
          <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
    <TextField
      disabled
      class="w-full max-w-[280px]"
      default-value="10"
      name="price"
      label="Set a price"
    >
      <InputGroup :ui="{ input: 'w-full max-w-[200px]' }" type="number" prefix="$" suffix="USD" />
    </TextField>
  </div>
</template>

<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
