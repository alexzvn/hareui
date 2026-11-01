<template>
  <div class="flex w-80 flex-col gap-6">
    <FormField label="Username" error="That username is already taken.">
      <TextField default-value="robin" full-width />
    </FormField>
    <FormField label="Invite code" error help="Ask your workspace owner for a code.">
      <TextField full-width />
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { FormField, TextField } from '@hareui/vue'
</script>
