<script setup lang="ts">
import { Input, Label, TextField } from 'herouse'

const fieldClass
  = 'rounded-xl border border-border/80 bg-surface shadow-sm ring-1 ring-black/5 transition-[box-shadow,border-color] focus-visible:ring-2 focus-visible:ring-neutral-400/25 dark:ring-white/10 dark:focus-visible:ring-neutral-500/30'
</script>

<template>
  <TextField class="w-full max-w-64 gap-1.5" name="email">
    <template #default="{ id }">
      <Label :for="id" class="font-medium text-neutral-800 dark:text-neutral-100">
        Email
      </Label>
      <Input
        type="email"
        name="email"
        :class="['text-sm text-neutral-800 placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500', fieldClass]"
        placeholder="you@email.com"
      />
    </template>
  </TextField>
</template>
