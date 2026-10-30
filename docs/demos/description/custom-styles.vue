<template>
  <div class="flex w-64 flex-col gap-1">
    <Label for="workspace-slug">Workspace URL</Label>
    <Input id="workspace-slug" placeholder="acme" type="text" />
    <Description id="workspace-slug-hint" class="leading-relaxed tracking-wide">
      Lowercase letters and hyphens only. Used in app.example.com/acme
    </Description>
  </div>
</template>

<script setup lang="ts">
import { Description, Input, Label } from '@hareui/vue'
</script>
