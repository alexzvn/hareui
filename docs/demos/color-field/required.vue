<script setup lang="ts">
import { ColorField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <ColorField required class="w-[280px]" name="color" label="Brand Color" placeholder="#000000" />
    <ColorField required class="w-[280px]" name="theme-color" label="Theme Color" placeholder="#000000" description="Required field" />
  </div>
</template>
