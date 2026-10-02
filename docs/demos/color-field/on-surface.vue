<script setup lang="ts">
import { ColorField, Surface } from 'herouse'
</script>

<template>
  <Surface class="w-[320px] p-4">
    <ColorField
      default-value="#3B82F6"
      name="color"
      label="Theme Color"
      description="Select your theme color"
      variant="secondary"
    />
  </Surface>
</template>
