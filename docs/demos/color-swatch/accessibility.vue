<script setup lang="ts">
import { ColorSwatch } from '@hareui/vue'
</script>

<template>
  <div class="flex items-center gap-3">
    <ColorSwatch aria-label="Primary brand color" color="#0485F7" color-name="Ocean Blue" />
    <ColorSwatch aria-label="Error state color" color="#EF4444" color-name="Coral Red" />
    <ColorSwatch aria-label="Warning color" color="#F59E0B" color-name="Sunset Orange" />
  </div>
</template>
