<script setup lang="ts">
import { Button, InputGroup, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <TextField class="w-full max-w-[280px]" default-value="heroui.com" name="website" label="Website">
    <InputGroup :ui="{ input: 'w-full max-w-[280px]', suffix: 'pe-0' }">
      <template #suffix>
        <Button icon-only aria-label="Copy" size="sm" variant="ghost">
          <Icon icon="gravity-ui:copy" class="size-4" />
        </Button>
      </template>
    </InputGroup>
  </TextField>
</template>
