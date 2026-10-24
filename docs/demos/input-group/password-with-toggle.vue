<script setup lang="ts">
import { Button, InputGroup, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isVisible = ref(false)
</script>

<template>
  <TextField class="w-full max-w-[280px]" name="password" label="Password">
    <InputGroup
      :ui="{ input: 'w-full max-w-[280px]', suffix: 'pe-0' }"
      :type="isVisible ? 'text' : 'password'"
      :model-value="isVisible ? '87$2h.3diua' : '••••••••'"
    >
      <template #suffix>
        <Button
          icon-only
          :aria-label="isVisible ? 'Hide password' : 'Show password'"
          size="sm"
          variant="ghost"
          @click="isVisible = !isVisible"
        >
          <Icon :icon="isVisible ? 'gravity-ui:eye' : 'gravity-ui:eye-slash'" class="size-4" />
        </Button>
      </template>
    </InputGroup>
  </TextField>
</template>
