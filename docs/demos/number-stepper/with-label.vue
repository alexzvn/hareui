<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>

<template>
  <NumberStepper
    label="Checked bags"
    description="Up to 3 bags per passenger, 23 kg each"
    name="bags"
    :default-value="1"
    :min="0"
    :max="3"
  />
</template>
