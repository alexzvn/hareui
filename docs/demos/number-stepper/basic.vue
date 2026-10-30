<template>
  <NumberStepper aria-label="Servings" :default-value="2" :min="1" />
</template>

<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>
