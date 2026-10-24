<template>
  <TextField class="w-full max-w-[280px]" default-value="heroui" name="website" label="Website">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]' }" suffix=".com">
      <template #prefix>
        <Icon icon="gravity-ui:globe" class="size-4 text-muted" />
      </template>
    </InputGroup>
  </TextField>
</template>

<script setup lang="ts">
import { InputGroup, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
