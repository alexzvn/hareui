<script setup lang="ts">
import { ColorField } from '@hareui/vue'
</script>

<template>
  <div class="w-[400px] space-y-4">
    <ColorField full-width default-value="#10B981" name="color" label="Brand Color" />
    <ColorField full-width default-value="#8B5CF6" name="color-with-suffix" label="Theme Color" />
  </div>
</template>
