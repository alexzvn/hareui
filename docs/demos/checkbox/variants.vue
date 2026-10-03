<script setup lang="ts">
import { Checkbox } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">Primary variant</p>
      <Checkbox id="primary" name="primary" variant="primary" label="Primary checkbox" description="Standard styling with default background" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">Secondary variant</p>
      <Checkbox id="secondary" name="secondary" variant="secondary" label="Secondary checkbox" description="Lower emphasis variant for use in surfaces" />
    </div>
  </div>
</template>
