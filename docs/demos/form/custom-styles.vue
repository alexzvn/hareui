<script setup lang="ts">
import { Button, Form, Input, TextField } from '@hareui/vue'
</script>

<template>
  <Form
    class="flex w-80 flex-col gap-3 rounded-xl border border-border/80 bg-surface p-4 shadow-sm"
    @submit.prevent
  >
    <TextField required name="email" type="email" label="Work email">
      <Input class="bg-field" placeholder="you@company.com" />
    </TextField>
    <Button class="w-full" type="submit">
      Continue
    </Button>
  </Form>
</template>
