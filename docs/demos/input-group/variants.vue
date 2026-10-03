<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { InputGroup, TextField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <TextField class="w-[280px]" name="primary" label="Primary variant">
      <InputGroup variant="primary" placeholder="name@email.com">
        <template #prefix>
          <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
    <TextField class="w-[280px]" name="secondary" label="Secondary variant">
      <InputGroup variant="secondary" placeholder="name@email.com">
        <template #prefix>
          <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
  </div>
</template>
