<script setup lang="ts">
import { ColorField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <ColorField
      invalid
      required
      class="w-[280px]"
      name="color"
      label="Color"
      placeholder="#000000"
      error-message="Please enter a valid hex color"
    />
    <ColorField
      invalid
      class="w-[280px]"
      default-value="#000000"
      name="invalid-color"
      label="Background Color"
      error-message="Invalid color format. Use hex (e.g., #FF5733)"
    />
  </div>
</template>
