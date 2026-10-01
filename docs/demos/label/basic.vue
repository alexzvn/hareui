<script setup lang="ts">
import { Input, Label } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-1">
    <Label for="name">Name</Label>
    <Input id="name" class="w-64" placeholder="Enter your name" type="text" />
  </div>
</template>
