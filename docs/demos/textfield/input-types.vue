<script setup lang="ts">
import { Input, TextField } from '@hareui/vue'
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <TextField label="Password" name="password" placeholder="••••••••" type="password" />
    <TextField label="Age" name="age">
      <Input max="150" min="0" name="age" placeholder="21" type="number" />
    </TextField>
    <TextField label="Email" name="email" placeholder="user@example.com" type="email" />
    <TextField label="Website" name="website" placeholder="https://example.com" type="url" />
    <TextField label="Phone" name="phone" placeholder="+1 (555) 000-0000" type="tel" />
  </div>
</template>
