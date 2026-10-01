<script setup lang="ts">
import { Input, Label } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Label</h1>
    <section class="flex flex-wrap items-end gap-6">
      <Label>Default</Label>
      <Label required>Required</Label>
      <Label disabled>Disabled</Label>
      <Label invalid>Invalid</Label>
      <Label required invalid>Required + invalid</Label>
    </section>
    <section class="flex flex-col gap-1">
      <h2 class="text-sm text-muted">for wiring (click the label to focus)</h2>
      <Label for="pg-label-name">Name</Label>
      <Input id="pg-label-name" class="w-64" placeholder="Enter your name" />
    </section>
    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-muted">Ancestor state attributes</h2>
      <div data-required="true"><Label>Parent data-required</Label></div>
      <div data-disabled="true"><Label>Ancestor data-disabled</Label></div>
      <div data-invalid="true"><Label>Ancestor data-invalid</Label></div>
    </section>
    <section>
      <h2 class="text-sm text-muted">:ui override</h2>
      <Label required :ui="{ base: 'uppercase tracking-wide text-accent' }">Custom</Label>
    </section>
  </div>
</template>
