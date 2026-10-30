<template>
  <div class="flex flex-col gap-1.5">
    <Label class="text-xs font-semibold tracking-wide text-accent uppercase" for="repo">
      Repository
    </Label>
    <Input id="repo" class="w-64 bg-field" placeholder="hareui/vue" />
  </div>
</template>

<script setup lang="ts">
import { Input, Label } from '@hareui/vue'
</script>
