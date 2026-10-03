<script setup lang="ts">
import { Description, Input, Label } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-1">
    <Label for="email">Email</Label>
    <Input
      id="email"
      aria-describedby="email-description"
      class="w-64"
      placeholder="you@example.com"
      type="email"
    />
    <Description id="email-description">
      We'll never share your email with anyone else.
    </Description>
  </div>
</template>
