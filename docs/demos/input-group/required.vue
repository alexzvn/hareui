<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <TextField required class="w-full max-w-[280px]" name="email" label="Email address">
      <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" placeholder="name@email.com">
        <template #prefix>
          <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
    <TextField
      required
      class="w-full max-w-[280px]"
      name="price"
      label="Set a price"
      description="What customers would pay"
    >
      <InputGroup
        :ui="{ input: 'w-full max-w-[200px]' }"
        placeholder="0"
        type="number"
        prefix="$"
        suffix="USD"
      />
    </TextField>
  </div>
</template>
