<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>

<template>
  <NumberStepper aria-label="Volume" :default-value="6" :min="0" :max="10" reversed />
</template>
