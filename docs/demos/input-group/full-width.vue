<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { InputGroup, TextField } from 'herouse'
</script>

<template>
  <div class="w-[400px] space-y-4">
    <TextField full-width name="email" label="Email address">
      <InputGroup full-width placeholder="name@email.com">
        <template #prefix>
          <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
    <TextField full-width name="password" label="Password">
      <InputGroup full-width placeholder="Enter password" type="password">
        <template #suffix>
          <Icon icon="gravity-ui:eye" class="size-4 text-muted" />
        </template>
      </InputGroup>
    </TextField>
  </div>
</template>
