<script setup lang="ts">
import { Input, Surface, TextArea, TextField } from '@hareui/vue'
</script>

<template>
  <Surface class="flex w-full min-w-[340px] flex-col gap-4 rounded-3xl p-6">
    <TextField
      name="name"
      variant="secondary"
      label="Your name"
      description="We'll never share this with anyone else"
    >
      <Input class="w-full" placeholder="John" />
    </TextField>
    <TextField name="email" type="email" variant="secondary" label="Email">
      <Input class="w-full" placeholder="john@example.com" />
    </TextField>
    <TextField name="bio" variant="secondary" label="Bio" description="Minimum 4 rows">
      <TextArea class="w-full" placeholder="Tell us about yourself..." :rows="4" />
    </TextField>
  </Surface>
</template>
