<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { InputGroup, TextField } from '@hareui/vue'
</script>

<template>
  <TextField class="w-full max-w-xs" name="email" label="Work email">
    <InputGroup class="rounded-xl border border-border/80 bg-default shadow-sm" placeholder="you@company.com">
      <template #prefix>
        <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
      </template>
    </InputGroup>
  </TextField>
</template>
