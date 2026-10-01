<script setup lang="ts">
import { Description, Input, Label } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Description</h1>
    <Description>We'll never share your email with anyone else.</Description>
    <div class="flex w-64 flex-col gap-1">
      <Label for="pg-desc-email">Email</Label>
      <Input id="pg-desc-email" aria-describedby="pg-desc-email-d" placeholder="you@example.com" />
      <Description id="pg-desc-email-d">A very_long_unbroken_word_that_should_wrap_inside_the_description_container</Description>
    </div>
    <Description :ui="{ base: 'text-sm text-accent' }">:ui override</Description>
  </div>
</template>
