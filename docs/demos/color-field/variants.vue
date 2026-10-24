<template>
  <div class="flex flex-col gap-4">
    <ColorField
      class="w-[280px]"
      default-value="#0485F7"
      name="primary-color"
      label="Primary variant"
      variant="primary"
    />
    <ColorField
      class="w-[280px]"
      default-value="#F43F5E"
      name="secondary-color"
      label="Secondary variant"
      variant="secondary"
    />
  </div>
</template>

<script setup lang="ts">
import { ColorField } from '@hareui/vue'
</script>
