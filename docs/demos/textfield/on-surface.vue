<script setup lang="ts">
import { Input, TextField } from 'herouse'
</script>

<template>
  <!-- herouse has no Surface component; these are HeroUI's `Surface` (variant "default") classes.
       herouse has no TextArea yet, so the Bio field uses an Input. -->
  <div data-slot="surface" class="relative flex w-full min-w-[340px] flex-col gap-4 rounded-3xl bg-surface p-6 text-surface-foreground">
    <TextField name="name" variant="secondary" label="Your name" description="We'll never share this with anyone else">
      <Input class="w-full" placeholder="John" />
    </TextField>
    <TextField name="email" type="email" variant="secondary" label="Email">
      <Input class="w-full" placeholder="john@example.com" />
    </TextField>
    <TextField name="bio" variant="secondary" label="Bio" description="Minimum 4 rows">
      <Input class="w-full" placeholder="Tell us about yourself..." />
    </TextField>
  </div>
</template>
