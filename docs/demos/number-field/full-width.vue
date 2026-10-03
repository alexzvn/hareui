<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>

<template>
  <div class="w-[400px] space-y-4">
    <NumberField full-width :default-value="1024" :min="0" name="width" label="Width" />
  </div>
</template>
