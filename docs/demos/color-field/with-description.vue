<script setup lang="ts">
import { ColorField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <ColorField class="w-[280px]" default-value="#3B82F6" name="color" label="Primary Color" description="Enter your brand's primary color" />
    <ColorField class="w-[280px]" default-value="#F59E0B" name="accent-color" label="Accent Color" description="Used for highlights and CTAs" />
  </div>
</template>
